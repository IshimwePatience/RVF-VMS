const { SurveillanceForm, SurveillanceSample, HomeVaccinationRecord, LabResult, sequelize } = require('../models');
const redisClient = require('../utils/redisClient');
const { Op } = require('sequelize');

exports.getGlobalOverview = async (req, res) => {
  try {
    const { province, district, sector } = req.query;
    
    // Construct cache key
    const cacheKey = `global_overview_${province || 'all'}_${district || 'all'}_${sector || 'all'}`;
    
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
      labWhere[Op.or] = [{ animal_district_origin: district }, { district: district }];
      vaxWhere.district = district;
    }
    if (sector) {
      surveillanceWhere.sector = sector;
      labWhere.sector = sector;
      vaxWhere.sector = sector;
    }

    // 1. Total Sample Test Forms
    const totalForms = await SurveillanceForm.count({ where: surveillanceWhere });

    // 2. Total Samples Collected
    const forms = await SurveillanceForm.findAll({
      where: surveillanceWhere,
      attributes: ['id']
    });
    const formIds = forms.map(f => f.id);
    const totalSamples = await SurveillanceSample.count({
      where: { form_id: { [Op.in]: formIds } }
    });

    // 3. Home Vaccination Records
    const totalVaxRecords = await HomeVaccinationRecord.count({ where: vaxWhere });

    // 4. Total Vaccines Given
    const totalVaccinesGivenResult = await HomeVaccinationRecord.sum('dose_given', { where: vaxWhere });
    const totalVaccinesGiven = totalVaccinesGivenResult || 0;

    // 5. Lab Results
    const labResults = await LabResult.findAll({
      where: labWhere,
      attributes: ['rvf_pcr_results']
    });
    
    const totalLabResults = labResults.length;
    
    let positive = 0;
    let negative = 0;
    
    labResults.forEach(r => {
      const pcr = r.pcr_result?.toLowerCase() || '';
      const rvf = r.rvf_pcr_results?.toLowerCase() || '';
      if (pcr === 'positive' || rvf.includes('positive')) positive++;
      else if (pcr === 'negative' || rvf.includes('negative')) negative++;
    });
    
    const pending = Math.max(0, totalSamples - totalLabResults);

    const data = {
      totalForms,
      totalSamples,
      totalVaxRecords,
      totalVaccinesGiven,
      totalLabResults,
      positive,
      negative,
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
