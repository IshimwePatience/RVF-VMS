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

    // Validation 2: Check if Animal IDs exist in SurveillanceSample
    const uploadedAnimalIds = results.map(r => r.animal_id ? String(r.animal_id).trim().toLowerCase() : null).filter(Boolean);
    if (uploadedAnimalIds.length === 0) {
      return res.status(400).json({ message: 'Upload rejected. No Animal IDs found in the file.' });
    }

    const { Op, Sequelize } = require('sequelize');
    const existingSamples = await SurveillanceSample.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.fn('TRIM', Sequelize.col('animal_id'))),
        {
          [Op.in]: uploadedAnimalIds
        }
      ),
      attributes: ['animal_id']
    });

    const existingIdSet = new Set(existingSamples.map(s => String(s.animal_id).trim().toLowerCase()));
    
    const mismatchedIds = [];
    for (const r of results) {
      if (!r.animal_id || !existingIdSet.has(String(r.animal_id).trim().toLowerCase())) {
        mismatchedIds.push(r.animal_id || 'Unknown ID');
      }
    }

    if (mismatchedIds.length > 0) {
      return res.status(400).json({ 
        message: `Upload rejected. The following Animal IDs do not exist in the system (mismatch): ${mismatchedIds.join(', ')}` 
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

    for (const item of results) {
      await LabResult.create({
        ...item,
        animal_id: item.animal_id ? String(item.animal_id).trim() : null,
        uploaded_by
      });
      createdCount++;
    }

    res.json({
      message: 'Results processed successfully',
      created: createdCount,
      updated: 0
    });
  } catch (error) {
    console.error('Error uploading lab results:', error);
    res.status(500).json({ message: error.message || 'Server error while validating or saving data' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const whereClause = {};
    if (req.user && req.user.role === 'Lab User') {
      whereClause.uploaded_by = req.user.id;
    }

    const { vet_phone } = req.query;
    let results = await LabResult.findAll({
      where: whereClause,
      include: [
        { model: LabTechnician, as: 'uploader', attributes: ['id', 'name', 'phone_number'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5000
    });

    if (vet_phone) {
      const { SurveillanceForm, SurveillanceSample } = require('../models');
      const forms = await SurveillanceForm.findAll({
        where: { veterinary_email: vet_phone },
        include: [{ model: SurveillanceSample, as: 'samples' }]
      });

      // strict filtering in memory to prevent cross-vet leakage for generic animal_ids
      results = results.filter(lr => {
        const lrId = lr.animal_id ? String(lr.animal_id).trim().toLowerCase() : '';
        const lrFarmer = lr.farmer_name ? String(lr.farmer_name).trim().toLowerCase() : '';
        const lrPhone = lr.phone ? String(lr.phone).trim().toLowerCase() : '';
        const lrDistrict = lr.animal_district_origin ? String(lr.animal_district_origin).trim().toLowerCase() : '';
        const lrSpecie = lr.specie ? String(lr.specie).trim().toLowerCase() : '';

        return forms.some(form => {
          const formDate = new Date(form.createdAt);
          if (!form.samples) return false;
          return form.samples.some(sample => {
            if (!sample.animal_id) return false;
            const searchId = String(sample.animal_id).trim().toLowerCase();
            const actualFarmer = sample.farmer_name || form.farmer_name || '';
            const actualPhone = sample.phone || form.phone_number || form.veterinary_email || '';
            const actualDistrict = sample.district_origin || form.district || '';

            const searchFarmer = actualFarmer ? String(actualFarmer).trim().toLowerCase() : '';
            const searchPhone = actualPhone ? String(actualPhone).trim().toLowerCase() : '';
            const searchDistrict = actualDistrict ? String(actualDistrict).trim().toLowerCase() : '';
            const searchSpecie = sample.specie ? String(sample.specie).trim().toLowerCase() : '';

            const isIdMatch = lrId === searchId;
            const isFarmerMatch = !searchFarmer || !lrFarmer || lrFarmer === searchFarmer;
            const isPhoneMatch = !searchPhone || !lrPhone || lrPhone === searchPhone;
            const isDistrictMatch = !searchDistrict || !lrDistrict || lrDistrict === searchDistrict;
            const isSpecieMatch = !searchSpecie || !lrSpecie || lrSpecie === searchSpecie;

            return isIdMatch && isFarmerMatch && isPhoneMatch && isDistrictMatch && isSpecieMatch && new Date(lr.createdAt) >= formDate;
          });
        });
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
