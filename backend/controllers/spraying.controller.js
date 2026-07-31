const { SprayingForm, SprayingRecord } = require('../models');

exports.createReport = async (req, res) => {
  try {
    const { veterinary_phone, itariki, records } = req.body;

    if (!veterinary_phone || !itariki || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const form = await SprayingForm.create({
      veterinary_phone,
      itariki,
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
    if (status) whereClause.status = status;

    const { SprayingForm, SprayingRecord, Veterinary } = require('../models');

    const forms = await SprayingForm.findAll({
      where: whereClause,
      include: [{ 
        model: SprayingRecord, 
        as: 'records',
        where: district ? { district } : undefined,
        required: district ? true : false
      }],
      order: [['createdAt', 'DESC']]
    });

    // Manually map veterinary names
    const phones = [...new Set(forms.map(f => f.veterinary_phone))].filter(Boolean);
    const veterinaries = await Veterinary.findAll({
      where: { phone_number: phones },
      attributes: ['phone_number', 'name']
    });

    const vetMap = {};
    veterinaries.forEach(v => vetMap[v.phone_number] = v.name);

    const formsWithVet = forms.map(f => {
      const data = f.toJSON();
      data.veterinary_name = vetMap[f.veterinary_phone] || null;
      return data;
    });

    res.json(formsWithVet);
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
