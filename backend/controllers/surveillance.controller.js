const { SurveillanceForm, SurveillanceSample, LabResult, sequelize } = require('../models');

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
        await SurveillanceSample.create({
          form_id: form.id,
          sn: sample.sn,
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
    const { phone } = req.query;
    let whereClause = {};
    if (phone) {
      whereClause.veterinary_email = phone;
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
      limit: 1000
    });

    // Extract all unique animal IDs from the forms to prevent fetching the entire database
    const animalIds = new Set();
    forms.forEach(form => {
      const formJSON = form.toJSON ? form.toJSON() : form;
      if (formJSON.samples) {
        formJSON.samples.forEach(sample => {
          if (sample.animal_id) {
            animalIds.add(String(sample.animal_id).trim());
            animalIds.add(String(sample.animal_id).trim().toLowerCase());
            animalIds.add(String(sample.animal_id).trim().toUpperCase());
          }
        });
      }
    });

    const { Op } = require('sequelize');
    const labResults = await LabResult.findAll({ 
      where: {
        animal_id: {
          [Op.in]: Array.from(animalIds)
        }
      },
      attributes: ['animal_id', 'farmer_name', 'phone', 'animal_district_origin', 'specie', 'createdAt', 'rvf_pcr_results'] 
    });

    const formsWithFlags = forms.map(form => {
      const formJSON = form.toJSON();
      const formDate = new Date(formJSON.createdAt);
      if (formJSON.samples) {
        formJSON.samples = formJSON.samples.map(sample => {
          let hasResult = false;
          let pcrResult = null;
          if (sample.animal_id) {
            const searchId = String(sample.animal_id).trim().toLowerCase();
            const actualFarmer = sample.farmer_name || formJSON.farmer_name || '';
            const actualPhone = sample.phone || formJSON.phone_number || formJSON.veterinary_email || '';
            const actualDistrict = sample.district_origin || formJSON.district || '';
            
            const searchFarmer = actualFarmer ? String(actualFarmer).trim().toLowerCase() : '';
            const searchPhone = actualPhone ? String(actualPhone).trim().toLowerCase() : '';
            const searchDistrict = actualDistrict ? String(actualDistrict).trim().toLowerCase() : '';
            const searchSpecie = sample.specie ? String(sample.specie).trim().toLowerCase() : '';
            
            // Find a lab result matching all criteria uploaded AFTER the sample was submitted
            const lrMatch = labResults.find(lr => {
              const lrId = lr.animal_id ? String(lr.animal_id).trim().toLowerCase() : '';
              const lrFarmer = lr.farmer_name ? String(lr.farmer_name).trim().toLowerCase() : '';
              const lrPhone = lr.phone ? String(lr.phone).trim().toLowerCase() : '';
              const lrDistrict = lr.animal_district_origin ? String(lr.animal_district_origin).trim().toLowerCase() : '';
              const lrSpecie = lr.specie ? String(lr.specie).trim().toLowerCase() : '';

              const isIdMatch = lrId === searchId;
              const isFarmerMatch = !searchFarmer || !lrFarmer || lrFarmer === searchFarmer;
              const isPhoneMatch = !searchPhone || !lrPhone || lrPhone === searchPhone;
              const isDistrictMatch = !searchDistrict || !lrDistrict || lrDistrict === searchDistrict;
              const isSpecieMatch = !searchSpecie || !lrSpecie || lrSpecie === searchSpecie;

              return isIdMatch && isFarmerMatch && isPhoneMatch && isDistrictMatch && isSpecieMatch && new Date(lr.createdAt) >= formDate;
            });
            if (lrMatch) {
              hasResult = true;
              pcrResult = lrMatch.rvf_pcr_results;
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
