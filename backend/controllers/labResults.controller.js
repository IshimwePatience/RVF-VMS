const { LabResult, User } = require('../models');

exports.uploadResults = async (req, res) => {
  try {
    const results = req.body; // Expecting an array of objects
    if (!Array.isArray(results)) {
      return res.status(400).json({ message: 'Payload must be an array of results' });
    }

    const uploaded_by = req.user.id;
    let createdCount = 0;
    let updatedCount = 0;

    for (const item of results) {
      // Find if it already exists based on animal_id and farmer name (or just animal_id)
      // Since animal_id is supposed to be unique to a test.
      // If animal_id is missing, we might use S/N or just farmer_name + phone + specie
      const whereClause = {};
      if (item.animal_id) {
        whereClause.animal_id = item.animal_id;
      } else {
        whereClause.farmer_name = item.farmer_name;
        whereClause.phone = item.phone;
        whereClause.specie = item.specie;
      }

      const [record, created] = await LabResult.findOrCreate({
        where: whereClause,
        defaults: {
          ...item,
          uploaded_by
        }
      });

      if (!created) {
        // Update existing record
        await record.update({
          ...item,
          uploaded_by
        });
        updatedCount++;
      } else {
        createdCount++;
      }
    }

    res.json({
      message: 'Results processed successfully',
      created: createdCount,
      updated: updatedCount
    });
  } catch (error) {
    console.error('Error uploading lab results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await LabResult.findAll({
      include: [
        { model: User, as: 'uploader', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
