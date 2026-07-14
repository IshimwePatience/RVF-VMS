const { Op } = require('sequelize');
const { Vaccine, StockInventory, Batch, Request, User, Stock, AdministrationRecord, Veterinary, LabTechnician } = require('../models');

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const query = `%${q}%`;
    const results = [];
    const role = req.user.role;
    const stock_id = req.user.stock_id;
    
    // 1. Search Vaccines
    const vaccines = await Vaccine.findAll({
      where: { name: { [Op.iLike]: query } },
      limit: 5
    });
    vaccines.forEach(v => results.push({ 
      id: `vac-${v.id}`, 
      type: 'Vaccine', 
      label: v.name, 
      description: `Vaccine Type: ${v.type || 'Standard'}`, 
      link: '/vaccines' 
    }));
    
    // 2. Search Inventory
    let invWhere = {};
    if (role !== 'Admin' && stock_id) invWhere.stock_id = stock_id;
    
    const inventory = await StockInventory.findAll({
      where: invWhere,
      include: [{
        model: Batch,
        where: { batch_number: { [Op.iLike]: query } },
        include: [Vaccine]
      }],
      limit: 5
    });
    inventory.forEach(i => results.push({ 
      id: `inv-${i.id}`, 
      type: 'Inventory', 
      label: `Batch ${i.Batch.batch_number}`, 
      description: `${i.Batch.Vaccine?.name || 'Vaccine'} - ${i.quantity_available} doses`, 
      link: '/inventory' 
    }));
    
    // 3. Search Requests
    let reqWhere = {};
    if (role !== 'Admin' && stock_id) {
      reqWhere = {
        [Op.or]: [
          { requesting_stock_id: stock_id },
          { parent_stock_id: stock_id }
        ]
      };
    }
    
    const requests = await Request.findAll({
      where: reqWhere,
      include: [{
        model: Vaccine,
        where: { name: { [Op.iLike]: query } }
      }],
      limit: 5,
      subQuery: false
    });
    requests.forEach(r => results.push({ 
      id: `req-${r.id}`, 
      type: 'Request', 
      label: `Req #${r.id.substring(0, 8)}`, 
      description: `${r.Vaccine?.name || 'Vaccine'} - ${r.status}`, 
      link: '/requests' 
    }));
    
    // 4. Search Administration Records (for Endpoint users)
    if (role !== 'Admin' && stock_id) {
      const administrations = await AdministrationRecord.findAll({
        where: {
          stock_id: stock_id,
          veterinary_name: { [Op.iLike]: query }
        },
        include: [{
          model: Batch,
          include: [Vaccine]
        }],
        limit: 5
      });
      administrations.forEach(a => results.push({
        id: `adm-${a.id}`,
        type: 'Administration',
        label: a.veterinary_name,
        description: `Administered ${a.quantity} doses of ${a.Batch?.Vaccine?.name || 'Vaccine'}`,
        link: '/administrations'
      }));
    }

    // 5. Search Veterinaries
    let vetWhere = {
      [Op.or]: [
        { name: { [Op.iLike]: query } },
        { phone_number: { [Op.iLike]: query } },
        { national_id: { [Op.iLike]: query } }
      ]
    };
    if (role !== 'Admin') {
      if (req.user.district) {
        vetWhere.district = req.user.district;
      } else if (stock_id) {
        const userStock = await Stock.findByPk(stock_id);
        if (userStock && userStock.district) {
          vetWhere.district = userStock.district;
        } else {
          vetWhere.stock_id = stock_id;
        }
      }
    }
    const veterinaries = await Veterinary.findAll({
      where: vetWhere,
      limit: 5
    });
    veterinaries.forEach(v => results.push({
      id: `vet-${v.id}`,
      type: 'Veterinary',
      label: v.name,
      description: v.district ? `Veterinary in ${v.district}` : 'Veterinary',
      link: '/veterinaries'
    }));

    // 6. Search Lab Technicians
    let labTechWhere = {
      [Op.or]: [
        { name: { [Op.iLike]: query } },
        { phone_number: { [Op.iLike]: query } }
      ]
    };
    if (role !== 'Admin' && req.user.district) {
      labTechWhere.district = req.user.district;
    }
    const labTechnicians = await LabTechnician.findAll({
      where: labTechWhere,
      limit: 5
    });
    labTechnicians.forEach(l => results.push({
      id: `lab-${l.id}`,
      type: 'Lab Technician',
      label: l.name,
      description: l.district ? `Lab Tech in ${l.district}` : 'Lab Technician',
      link: '/lab-technicians'
    }));
    
    // 7. Admin only: Search Users and Stocks
    if (role === 'Admin') {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: query } },
            { role: { [Op.iLike]: query } }
          ]
        },
        limit: 5
      });
      users.forEach(u => results.push({ 
        id: `usr-${u.id}`, 
        type: 'User', 
        label: u.username, 
        description: `Role: ${u.role}`, 
        link: '/users' 
      }));
      
      const stocks = await Stock.findAll({
        where: { name: { [Op.iLike]: query } },
        limit: 5
      });
      stocks.forEach(s => results.push({ 
        id: `stk-${s.id}`, 
        type: 'Stock', 
        label: s.name, 
        description: s.is_central ? 'Central Hub' : 'Stock Point', 
        link: '/stocks' 
      }));
    }
    
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
};
