const { SurveillanceForm, SurveillanceSample, sequelize } = require('../models');

exports.submitForm = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      veterinary_email,
      district,
      from_abattoir,
      samples_type,
      abattoir_details,
      collection_date,
      test_requested,
      submitted_by,
      phone_number,
      samples
    } = req.body;

    if (!veterinary_email) {
      await t.rollback();
      return res.status(400).json({ message: 'Veterinary email is required' });
    }

    const form = await SurveillanceForm.create({
      veterinary_email,
      district,
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
