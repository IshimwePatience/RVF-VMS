const { Veterinary, Stock } = require('../models');

exports.getVeterinaries = async (req, res) => {
  try {
    const { role, stock_id } = req.user;
    const { province, district, sector } = req.query;
    
    let where = {};
    
    // If endpoint user (not admin), only show their veterinaries
    if (role !== 'Admin') {
      where.stock_id = stock_id;
    }
    
    // Filters for Admins
    if (province) where.province = province;
    if (district) where.district = district;
    if (sector) where.sector = sector;
    
    const veterinaries = await Veterinary.findAll({
      where,
      include: role === 'Admin' ? [{ model: Stock, attributes: ['name', 'is_endpoint'] }] : [],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(veterinaries);
  } catch (err) {
    console.error('Failed to fetch veterinaries:', err);
    res.status(500).json({ error: 'Failed to fetch veterinaries' });
  }
};

exports.createVeterinary = async (req, res) => {
  try {
    const { name, email, phone_number, national_id, province, district, sector, cell, village } = req.body;
    
    // Only endpoint users should create veterinaries for their stock
    const stock_id = req.user.stock_id;
    if (!stock_id) {
      return res.status(400).json({ error: 'Must be associated with a stock point to create a veterinary' });
    }

    const newVet = await Veterinary.create({
      stock_id,
      name,
      email,
      phone_number,
      national_id,
      province,
      district,
      sector,
      cell,
      village
    });
    
    res.status(201).json(newVet);
  } catch (err) {
    console.error('Failed to create veterinary:', err);
    res.status(500).json({ error: 'Failed to create veterinary' });
  }
};

exports.updateVeterinary = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, national_id, province, district, sector, cell, village } = req.body;
    
    const vet = await Veterinary.findOne({ where: { id, stock_id: req.user.stock_id } });
    if (!vet) return res.status(404).json({ error: 'Veterinary not found' });
    
    await vet.update({
      name, email, phone_number, national_id, province, district, sector, cell, village
    });
    
    res.json(vet);
  } catch (err) {
    console.error('Failed to update veterinary:', err);
    res.status(500).json({ error: 'Failed to update veterinary' });
  }
};

exports.deleteVeterinary = async (req, res) => {
  try {
    const { id } = req.params;
    const vet = await Veterinary.findOne({ where: { id, stock_id: req.user.stock_id } });
    
    if (!vet) return res.status(404).json({ error: 'Veterinary not found' });
    
    await vet.destroy();
    res.json({ message: 'Veterinary deleted successfully' });
  } catch (err) {
    console.error('Failed to delete veterinary:', err);
    res.status(500).json({ error: 'Failed to delete veterinary' });
  }
};
