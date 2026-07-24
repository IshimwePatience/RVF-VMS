const { SurveillanceForm, SurveillanceSample, LabResult, sequelize } = require('../models');
const crypto = require('crypto');

exports.submitForm = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      veterinary_phone,
      district,
      province,
      sector,
      cell,
      village,
      from_abattoir,
      samples_type,
      abattoir_details,
      collection_date,
      test_requested,
      submitted_by,
      phone_number,
      samples
    } = req.body;

    if (!veterinary_phone) {
      await t.rollback();
      return res.status(400).json({ message: 'Veterinary phone is required' });
    }

    const form = await SurveillanceForm.create({
      veterinary_email: veterinary_phone, // Store phone in the veterinary_email column
      district,
      province,
      sector,
      cell,
      village,
      from_abattoir,
      samples_type,
      abattoir_details,
      collection_date: collection_date || null,
      test_requested,
      submitted_by,
      phone_number
    }, { transaction: t });

    if (samples && Array.isArray(samples)) {
      const validSamples = samples.filter(s => s.farmer_name || s.animal_id);
      for (const sample of validSamples) {
        let tracking_id;
        while (true) {
          const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
          tracking_id = `RAB-${randomHex}`;
          const exists = await SurveillanceSample.findOne({ where: { tracking_id }, transaction: t });
          if (!exists) break;
        }

        await SurveillanceSample.create({
          form_id: form.id,
          sn: sample.sn,
          tracking_id: tracking_id,
          farmer_name: sample.farmer_name,
          phone: sample.phone,
          district_origin: sample.district_origin,
          sector: sample.sector,
          cell: sample.cell,
          village: sample.village,
          specie: sample.specie,
          animal_id: sample.animal_id,
          breed: sample.breed,
          sex: sample.sex,
          age: sample.age,
          vaccination_status: sample.vaccination_status,
          purpose: sample.purpose,
          health_status: sample.health_status
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ message: 'Surveillance form submitted successfully', form });
  } catch (error) {
    await t.rollback();
    console.error('Error submitting surveillance form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getForms = async (req, res) => {
  try {
    const { phone, district } = req.query;
    let whereClause = {};
    if (phone) {
      whereClause.veterinary_email = phone;
    }
    if (district) {
      whereClause.district = district;
    }
    const forms = await SurveillanceForm.findAll({
      where: whereClause,
      include: [
        {
          model: SurveillanceSample,
          as: 'samples'
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50000
    });

    // Extract all unique tracking IDs from the forms to fetch matching lab results
    const trackingIds = new Set();
    forms.forEach(form => {
      const formJSON = form.toJSON ? form.toJSON() : form;
      if (formJSON.samples) {
        formJSON.samples.forEach(sample => {
          if (sample.tracking_id) {
            trackingIds.add(sample.tracking_id);
          }
        });
      }
    });

    const { Op } = require('sequelize');
    const labResults = await LabResult.findAll({ 
      where: {
        sample_tracking_id: {
          [Op.in]: Array.from(trackingIds)
        }
      },
      attributes: ['sample_tracking_id', 'rvf_pcr_results'] 
    });

    // Precompute a Hash Map of lab results grouped by tracking_id for O(1) lookup
    const labResultsMap = {};
    for (const lr of labResults) {
      if (lr.sample_tracking_id) {
        labResultsMap[lr.sample_tracking_id] = lr;
      }
    }

    const formsWithFlags = forms.map(form => {
      const formJSON = form.toJSON ? form.toJSON() : form;
      if (formJSON.samples) {
        formJSON.samples = formJSON.samples.map(sample => {
          let hasResult = false;
          let pcrResult = null;
          
          if (sample.tracking_id) {
            const match = labResultsMap[sample.tracking_id];
            if (match) {
              hasResult = true;
              pcrResult = match.rvf_pcr_results;
            }
          }
          
          return {
            ...sample,
            has_result: hasResult,
            rvf_pcr_results: pcrResult
          };
        });
      }
      return formJSON;
    });

    res.json(formsWithFlags);
  } catch (error) {
    console.error('Error fetching surveillance forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveSample = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const sample = await SurveillanceSample.findByPk(id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    // Assuming we have the DARO's ID or name in req.user, but if not we just use "DARO"
    const approvedBy = req.user && req.user.role === 'DARO' ? req.user.id : 'DARO';

    sample.daro_approval_status = status;
    sample.daro_approved_by = approvedBy;
    sample.daro_approval_date = new Date();

    await sample.save();

    res.json({ message: 'Sample status updated', sample });
  } catch (error) {
    console.error('Error updating sample status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSample = async (req, res) => {
  try {
    const { id } = req.params;
    const sample = await SurveillanceSample.findByPk(id);
    if (!sample) return res.status(404).json({ message: 'Sample not found' });
    
    await sample.update(req.body);
    res.json(sample);
  } catch (error) {
    console.error('Error updating sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSample = async (req, res) => {
  try {
    const { id } = req.params;
    const sample = await SurveillanceSample.findByPk(id);
    if (!sample) return res.status(404).json({ message: 'Sample not found' });
    
    await sample.destroy();
    res.json({ message: 'Sample deleted successfully' });
  } catch (error) {
    console.error('Error deleting sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
