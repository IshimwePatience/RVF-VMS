const { SurveillanceForm, SurveillanceSample, HomeVaccinationRecord, LabResult, sequelize } = require('../models');
const redisClient = require('../utils/redisClient');
const { Op } = require('sequelize');

exports.getGlobalOverview = async (req, res) => {
  try {
    const { province, district, sector, dateFrom, dateTo, search } = req.query;
    
    // Construct cache key
    const cacheKey = `global_overview_${province || 'all'}_${district || 'all'}_${sector || 'all'}_${dateFrom || 'all'}_${dateTo || 'all'}_${search || 'all'}`;
    
    // Check cache
    if (redisClient.isReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    // Filters
    const surveillanceWhere = {};
    const labWhere = {};
    const vaxWhere = {};

    if (province) {
      surveillanceWhere.province = province;
      vaxWhere.province = province;
    }
    if (district) {
      surveillanceWhere.district = district;
      labWhere.animal_district_origin = district;
      vaxWhere.district = district;
    }
    if (sector) {
      surveillanceWhere.sector = sector;
      labWhere.sector = sector;
      vaxWhere.sector = sector;
    }

    if (dateFrom || dateTo) {
      const dateFilter = {};
      if (dateFrom) {
        const dFrom = new Date(dateFrom);
        if (!isNaN(dFrom)) dateFilter[Op.gte] = dFrom;
      }
      if (dateTo) {
        const dTo = new Date(dateTo);
        if (!isNaN(dTo)) {
          dTo.setHours(23, 59, 59, 999);
          dateFilter[Op.lte] = dTo;
        }
      }
      
      if (Object.keys(dateFilter).length > 0) {
        surveillanceWhere.createdAt = dateFilter;
        labWhere.createdAt = dateFilter;
        vaxWhere.createdAt = dateFilter;
      }
    }

    if (search) {
      const searchPattern = `%${search}%`;
      // For overview aggregate, doing a global text search across multiple tables is extremely slow.
      // We limit search to primary identifiable fields if a search is provided
      surveillanceWhere.farmer_name = { [Op.iLike]: searchPattern };
      labWhere.farmer_name = { [Op.iLike]: searchPattern };
      vaxWhere.owner_name = { [Op.iLike]: searchPattern };
    }

    // 1. Total Sample Test Forms
    const totalForms = await SurveillanceForm.count({ where: surveillanceWhere });

    // 2. Total Samples Collected
    // We use an include to filter samples by their parent form's attributes (date, province, etc)
    const totalSamples = await SurveillanceSample.count({
      include: [{
        model: SurveillanceForm,
        where: surveillanceWhere,
        required: true,
        attributes: []
      }]
    });

    // 3. Home Vaccination Records
    const totalVaxRecords = await HomeVaccinationRecord.count({ where: vaxWhere });

    // 4. Total Vaccines Given
    const totalVaccinesGivenResult = await HomeVaccinationRecord.sum('dose_given', { where: vaxWhere });
    const totalVaccinesGiven = totalVaccinesGivenResult || 0;

    // 5. Lab Results
    const totalLabResults = await LabResult.count({ where: labWhere });
    
    // We can count positive and negative directly in SQL instead of mapping in Node
    // Or at least just query the counts!
    const positiveCount = await LabResult.count({
      where: {
        ...labWhere,
        [Op.or]: [
          { rvf_pcr_results: { [Op.iLike]: '%positive%' } }
        ]
      }
    });

    const negativeCount = await LabResult.count({
      where: {
        ...labWhere,
        [Op.or]: [
          { rvf_pcr_results: { [Op.iLike]: '%negative%' } }
        ]
      }
    });

    const pending = Math.max(0, totalSamples - totalLabResults);

    const data = {
      totalForms,
      totalSamples,
      totalVaxRecords,
      totalVaccinesGiven,
      totalLabResults,
      positive: positiveCount,
      negative: negativeCount,
      pending
    };

    // Cache for 5 minutes
    if (redisClient.isReady) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(data));
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
