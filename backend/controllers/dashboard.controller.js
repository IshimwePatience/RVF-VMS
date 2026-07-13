const { AdministrationRecord, StockInventory, Batch, Vaccine, Stock, SurveillanceForm, SurveillanceSample } = require('../models');
const { Sequelize, Op } = require('sequelize');

exports.getAdminDashboard = async (req, res) => {
  try {
    const { province, district, sector, dateFrom, dateTo } = req.query;
    
    // Construct Where Clauses
    const whereAdmin = {};
    const whereSurvForm = {};
    
    if (province) {
      whereAdmin.province = province;
      whereSurvForm.province = province;
    }
    if (req.user && req.user.role !== 'Admin' && !req.user.is_central && req.user.district) {
      whereAdmin.district = req.user.district;
      whereSurvForm.district = req.user.district;
    } else if (district) {
      whereAdmin.district = district;
      whereSurvForm.district = district;
    }
    if (sector) {
      whereAdmin.sector = sector;
      whereSurvForm.sector = sector;
    }
    if (dateFrom) {
      whereAdmin.date_administered = { ...whereAdmin.date_administered, [Op.gte]: new Date(dateFrom) };
      whereSurvForm.collection_date = { ...whereSurvForm.collection_date, [Op.gte]: new Date(dateFrom) };
    }
    if (dateTo) {
      whereAdmin.date_administered = { ...whereAdmin.date_administered, [Op.lte]: new Date(dateTo) };
      whereSurvForm.collection_date = { ...whereSurvForm.collection_date, [Op.lte]: new Date(dateTo) };
    }

    // 1. Summary Metrics
    const totalDoses = await AdministrationRecord.sum('doses_used', { where: whereAdmin }) || 0;
    const totalAffected = await AdministrationRecord.sum('animals_affected', { where: whereAdmin }) || 0;
    const totalDied = await AdministrationRecord.sum('animals_died', { where: whereAdmin }) || 0;
    
    const inventories = await StockInventory.findAll({ include: [{ model: Batch, attributes: ['price_per_dose_rwf'] }] });
    let totalStockValue = 0;
    let totalVaccinesInStock = 0;
    inventories.forEach(inv => {
      totalVaccinesInStock += inv.quantity_available;
      if (inv.Batch && inv.Batch.price_per_dose_rwf) {
        totalStockValue += inv.quantity_available * inv.Batch.price_per_dose_rwf;
      }
    });

    const samplesCount = await SurveillanceSample.count({
      include: [{ model: SurveillanceForm, where: whereSurvForm, required: true }]
    });

    // 2. Daily Epidemic Curve (Cases by Date)
    const dailyCurveRaw = await AdministrationRecord.findAll({
      attributes: [
        [Sequelize.literal('DATE(date_administered)'), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('animals_affected')), 'affected'],
        [Sequelize.fn('SUM', Sequelize.col('doses_used')), 'doses']
      ],
      where: whereAdmin,
      group: [Sequelize.literal('DATE(date_administered)')],
      order: [[Sequelize.literal('DATE(date_administered)'), 'ASC']],
      limit: 30,
      raw: true
    });

    // 3. Clinical Outcomes (Surveillance Samples health_status)
    const outcomesRaw = await SurveillanceSample.findAll({
      attributes: [
        'health_status',
        [Sequelize.fn('COUNT', Sequelize.col('SurveillanceSample.id')), 'count']
      ],
      include: [{ model: SurveillanceForm, where: whereSurvForm, attributes: [], required: true }],
      group: ['health_status'],
      raw: true
    });

    // 4. Cases by District (Administration animals_affected)
    const districtImpact = await AdministrationRecord.findAll({
      attributes: [
        'district',
        [Sequelize.fn('SUM', Sequelize.col('animals_affected')), 'affected']
      ],
      where: whereAdmin,
      group: ['district'],
      order: [[Sequelize.literal('SUM(animals_affected)'), 'DESC']],
      limit: 10,
      raw: true
    });

    // 5. Species Distribution
    const speciesDistribution = await SurveillanceSample.findAll({
      attributes: [
        'specie',
        [Sequelize.fn('COUNT', Sequelize.col('SurveillanceSample.id')), 'count']
      ],
      include: [{ model: SurveillanceForm, where: whereSurvForm, attributes: [], required: true }],
      group: ['specie'],
      order: [[Sequelize.literal('COUNT("SurveillanceSample"."id")'), 'DESC']],
      raw: true
    });

    // 6. Sex Distribution
    const sexDistribution = await SurveillanceSample.findAll({
      attributes: [
        'sex',
        [Sequelize.fn('COUNT', Sequelize.col('SurveillanceSample.id')), 'count']
      ],
      include: [{ model: SurveillanceForm, where: whereSurvForm, attributes: [], required: true }],
      group: ['sex'],
      raw: true
    });

    // 7. Vaccination Status Distribution
    const vaccinationStatus = await SurveillanceSample.findAll({
      attributes: [
        'vaccination_status',
        [Sequelize.fn('COUNT', Sequelize.col('SurveillanceSample.id')), 'count']
      ],
      include: [{ model: SurveillanceForm, where: whereSurvForm, attributes: [], required: true }],
      group: ['vaccination_status'],
      raw: true
    });

    // 8. Vaccine Stock Distribution
    const stockRaw = await StockInventory.findAll({
      include: [{ model: Batch, include: [{ model: Vaccine }] }]
    });
    const stockMap = {};
    stockRaw.forEach(inv => {
      if (inv.Batch && inv.Batch.Vaccine) {
        const vName = inv.Batch.Vaccine.name;
        stockMap[vName] = (stockMap[vName] || 0) + inv.quantity_available;
      }
    });

    // 9. Locations for Map
    const survForms = await SurveillanceForm.findAll({
      where: whereSurvForm,
      include: [{
        model: SurveillanceSample,
        as: 'samples',
        attributes: ['id', 'district_origin', 'sector', 'cell', 'village']
      }],
      order: [['createdAt', 'DESC']]
    });

    const survLocations = [];
    survForms.forEach(form => {
      if (form.samples && form.samples.length > 0) {
        form.samples.forEach(sample => {
          survLocations.push({
            id: `surv-${form.id}-samp-${sample.id}`,
            province: form.province, // Form province
            district: sample.district_origin || form.district, // Prefer sample's district
            sector: sample.sector || form.sector,
            cell: sample.cell || form.cell,
            village: sample.village || form.village,
            createdAt: form.createdAt
          });
        });
      } else {
        survLocations.push({
          id: `surv-${form.id}`,
          province: form.province,
          district: form.district,
          sector: form.sector,
          cell: form.cell,
          village: form.village,
          createdAt: form.createdAt
        });
      }
    });
    const adminLocations = await AdministrationRecord.findAll({
      attributes: ['id', 'province', 'district', 'sector', 'cell', 'village', 'createdAt'],
      where: whereAdmin,
      order: [['date_administered', 'DESC']]
    });
    
    // Combine all locations
    const mapLocations = [...survLocations, ...adminLocations]
      .sort((a, b) => new Date(b.createdAt || b.date_administered) - new Date(a.createdAt || a.date_administered));

    res.json({
      summary: {
        totalAffected,
        totalDied,
        totalDoses,
        totalVaccinesInStock,
        totalStockValue,
        samplesCount
      },
      dailyCurve: dailyCurveRaw,
      outcomes: outcomesRaw,
      districtImpact,
      speciesDistribution,
      sexDistribution,
      vaccinationStatus,
      stockByVaccine: Object.entries(stockMap).map(([name, quantity]) => ({ name, quantity })),
      mapLocations
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

exports.getEndpointDashboard = async (req, res) => {
  try {
    const { stock_id } = req.user;
    if (!stock_id) {
      return res.status(400).json({ message: 'User not associated with a stock point' });
    }

    const reports = await AdministrationRecord.findAll({
      where: { stock_id },
      order: [['date_administered', 'DESC']],
      limit: 20
    });

    const usedRaw = await AdministrationRecord.sum('doses_used', { where: { stock_id } });
    const damagedRaw = await AdministrationRecord.sum('doses_wasted', { where: { stock_id } });
    const stockRaw = await StockInventory.sum('quantity_available', { where: { stock_id } });

    res.json({ 
      reports,
      vaccinesUsed: usedRaw || 0,
      vaccinesDamaged: damagedRaw || 0,
      stockLevel: stockRaw || 0
    });
  } catch (error) {
    console.error('Error fetching endpoint dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

exports.getInventoryDashboard = async (req, res) => {
  try {
    // Zipline/Operations view - just aggregate supply levels
    const suppliesRaw = await StockInventory.findAll({
      include: [
        { model: Stock },
        {
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    const supplyMap = {};
    suppliesRaw.forEach(inv => {
      if (inv.Batch && inv.Batch.Vaccine) {
        const vId = inv.Batch.vaccine_id;
        if (!supplyMap[vId]) {
          supplyMap[vId] = {
            vaccine_id: vId,
            vaccine_name: inv.Batch.Vaccine.name,
            total_quantity: 0,
            current_supply: 0,
            distributed_level: 0
          };
        }
        supplyMap[vId].total_quantity += inv.quantity_available;
        
        if (inv.Stock && inv.Stock.is_central) {
          supplyMap[vId].current_supply += inv.quantity_available;
        } else {
          supplyMap[vId].distributed_level += inv.quantity_available;
        }
      }
    });

    res.json({ supplies: Object.values(supplyMap) });
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
