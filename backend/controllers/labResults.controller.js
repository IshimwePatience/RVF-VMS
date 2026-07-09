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
      await LabResult.create({
        ...item,
        uploaded_by
      });
      createdCount++;
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
