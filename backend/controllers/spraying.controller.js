const { SprayingForm, SprayingRecord } = require('../models');

exports.createReport = async (req, res) => {
  try {
    const { veterinary_phone, district, sector, records } = req.body;

    if (!veterinary_phone || !district || !sector || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const form = await SprayingForm.create({
      veterinary_phone,
      district,
      sector,
      status: 'pending'
    });

    const recordsToInsert = records.map(record => ({
      ...record,
      form_id: form.id
    }));

    await SprayingRecord.bulkCreate(recordsToInsert);

    res.status(201).json({ message: 'Spraying report created successfully', formId: form.id });
  } catch (error) {
    console.error('Error creating spraying report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { district, status } = req.query;
    const whereClause = {};
    if (district) whereClause.district = district;
    if (status) whereClause.status = status;

    const forms = await SprayingForm.findAll({
      where: whereClause,
      include: [{ model: SprayingRecord, as: 'records' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching spraying reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const form = await SprayingForm.findByPk(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (status) {
      form.status = status;
      await form.save();
    }

    res.json({ message: 'Report updated successfully', form });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await SprayingForm.findByPk(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await SprayingRecord.destroy({ where: { form_id: id } });
    await form.destroy();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
