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
    const uploadedAnimalIds = results.map(r => r.animal_id ? String(r.animal_id).trim() : null).filter(Boolean);
    if (uploadedAnimalIds.length === 0) {
      return res.status(400).json({ message: 'Upload rejected. No Animal IDs found in the file.' });
    }

    const existingSamples = await SurveillanceSample.findAll({
      where: {
        animal_id: uploadedAnimalIds
      },
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
    if (vet_phone) {
      const { SurveillanceForm, SurveillanceSample } = require('../models');
      const forms = await SurveillanceForm.findAll({
        where: { veterinary_email: vet_phone },
        include: [{ model: SurveillanceSample, as: 'samples' }]
      });
      const animalIds = [];
      forms.forEach(f => {
        if (f.samples) {
          f.samples.forEach(s => {
            if (s.animal_id) animalIds.push(String(s.animal_id).trim());
          });
        }
      });
      // If no samples found for this vet, ensure it returns empty array
      whereClause.animal_id = animalIds.length > 0 ? animalIds : ['__NO_MATCH__'];
    }

    const results = await LabResult.findAll({
      where: whereClause,
      include: [
        { model: LabTechnician, as: 'uploader', attributes: ['id', 'name', 'phone_number'] }
      ],
      order: [['createdAt', 'DESC']]
    });
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
