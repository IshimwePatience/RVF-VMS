const { LabResult, LabTechnician, SurveillanceSample } = require('../models');

exports.uploadResults = async (req, res) => {
  try {
    const results = req.body; // Expecting an array of objects
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: 'Payload must be a non-empty array of results' });
    }

    // Validation 1: Check for missing PCR results
    const missingPcr = results.filter(r => !r.rvf_pcr_results || String(r.rvf_pcr_results).trim() === '');
    if (missingPcr.length > 0) {
      const missingIds = missingPcr.map(r => r.animal_id || 'Unknown ID').join(', ');
      return res.status(400).json({ 
        message: `Upload rejected. Missing PCR Result for the following Animal IDs: ${missingIds}` 
      });
    }

    // Validation 2: Check if Tracking IDs exist in SurveillanceSample
    const uploadedTrackingIds = results.map(r => r.tracking_id ? String(r.tracking_id).trim().toUpperCase() : null).filter(Boolean);
    if (uploadedTrackingIds.length === 0) {
      return res.status(400).json({ message: 'Upload rejected. No Tracking IDs found in the file. Please ensure you are uploading using the Tracking ID column.' });
    }

    const { Op, Sequelize } = require('sequelize');
    const existingSamples = await SurveillanceSample.findAll({
      where: Sequelize.where(
        Sequelize.fn('UPPER', Sequelize.fn('TRIM', Sequelize.col('tracking_id'))),
        {
          [Op.in]: uploadedTrackingIds
        }
      ),
      attributes: ['tracking_id']
    });

    const existingIdSet = new Set(existingSamples.map(s => String(s.tracking_id).trim().toUpperCase()));
    
    const mismatchedIds = [];
    for (const r of results) {
      if (!r.tracking_id || !existingIdSet.has(String(r.tracking_id).trim().toUpperCase())) {
        mismatchedIds.push(r.tracking_id || 'Unknown ID');
      }
    }

    if (mismatchedIds.length > 0) {
      return res.status(400).json({ 
        message: `Upload rejected. The following Tracking IDs do not exist in the system: ${mismatchedIds.join(', ')}` 
      });
    }

    let uploaded_by = null;
    if (req.user.role === 'Lab User') {
      const tech = await LabTechnician.findByPk(req.user.id);
      if (tech) {
        uploaded_by = tech.id;
      }
    }
    let createdCount = 0;
    let updatedCount = 0;

    for (const item of results) {
      const tracking_id = item.tracking_id ? String(item.tracking_id).trim().toUpperCase() : null;
      if (tracking_id) {
        const existing = await LabResult.findOne({ where: { sample_tracking_id: tracking_id } });
        if (existing) {
          await existing.update({
            ...item,
            sample_tracking_id: tracking_id,
            animal_id: item.animal_id ? String(item.animal_id).trim() : null,
            uploaded_by
          });
          updatedCount++;
        } else {
          await LabResult.create({
            ...item,
            sample_tracking_id: tracking_id,
            animal_id: item.animal_id ? String(item.animal_id).trim() : null,
            uploaded_by
          });
          createdCount++;
        }
      }
    }

    res.json({
      message: 'Results processed successfully',
      created: createdCount,
      updated: updatedCount
    });
  } catch (error) {
    console.error('Error uploading lab results:', error);
    res.status(500).json({ message: error.message || 'Server error while validating or saving data' });
  }
};

exports.getResults = async (req, res) => {
  try {
    let canViewAll = false;
    if (req.user && req.user.role === 'Lab User') {
      const { LabTechnician } = require('../models');
      const tech = await LabTechnician.findByPk(req.user.id);
      if (tech && tech.can_view_all_results) {
        canViewAll = true;
      }
    }

    const whereClause = {};
    if (req.user && req.user.role === 'Lab User' && !canViewAll) {
      whereClause.uploaded_by = req.user.id;
    }

    const { vet_phone } = req.query;
    let results = await LabResult.findAll({
      where: whereClause,
      include: [
        { model: LabTechnician, as: 'uploader', attributes: ['id', 'name', 'phone_number'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50000,
      raw: true,
      nest: true
    });

    if (vet_phone) {
      const { SurveillanceForm, SurveillanceSample } = require('../models');
      const forms = await SurveillanceForm.findAll({
        where: { veterinary_email: vet_phone },
        include: [{ model: SurveillanceSample, as: 'samples' }]
      });

      // Pre-build a set of valid tracking ids for this vet
      const validTrackingIds = new Set();
      forms.forEach(form => {
        if (form.samples) {
          form.samples.forEach(sample => {
            if (sample.tracking_id) {
              validTrackingIds.add(String(sample.tracking_id).trim().toUpperCase());
            }
          });
        }
      });

      // strict filtering in memory to prevent cross-vet leakage
      results = results.filter(lr => {
        const lrTrackingId = lr.sample_tracking_id ? String(lr.sample_tracking_id).trim().toUpperCase() : '';
        return validTrackingIds.has(lrTrackingId);
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LabResult.findByPk(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    
    await result.update(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating lab result:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LabResult.findByPk(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    await result.destroy();
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab result:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LabResult.findByPk(id, {
      include: [
        { model: LabTechnician, as: 'uploader', attributes: ['id', 'name'] }
      ]
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Certificate not found or invalid ID' });
    }
    
    // Return only necessary public data
    res.json({
      id: result.id,
      farmer_name: result.farmer_name,
      animal_id: result.animal_id,
      specie: result.specie,
      rvf_pcr_results: result.rvf_pcr_results,
      tested_site: result.tested_site,
      date_tested: result.createdAt,
      lab_technician: result.uploader ? result.uploader.name : 'Unknown'
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
