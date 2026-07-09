const express = require('express');
const router = express.Router();
const rwanda = require('rwanda-locations');

const _provCache = {};

function getProvinceByDistrict(district) {
  if (!district) return null;
  const lowerDist = district.toLowerCase();
  if (_provCache[lowerDist]) return _provCache[lowerDist];
  
  for (const p of rwanda.getProvinces()) {
    const dists = rwanda.getDistricts(p) || [];
    if (dists.some(d => d.toLowerCase() === lowerDist)) {
      _provCache[lowerDist] = p;
      return p;
    }
  }
  return null;
}

const { Stock } = require('../models');

// Get all provinces
router.get('/provinces', (req, res) => {
  try {
    const provinces = rwanda.getProvinces();
    res.json(provinces || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get districts that have an active stock
router.get('/districts-with-stock', async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      attributes: ['district'],
      where: {
        is_central: false
      },
      group: ['district']
    });
    const districts = stocks.map(s => s.district).filter(Boolean);
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all districts or filter by province
router.get('/districts', (req, res) => {
  try {
    const { province } = req.query;
    if (province) {
      try {
        let provName = province;
        if (provName.toLowerCase() === 'kigali') provName = 'City Of Kigali';
        const districts = rwanda.getDistricts(provName);
        return res.json(districts || []);
      } catch (e) {
        return res.json([]);
      }
    }
    const provinces = rwanda.getProvinces();
    let allDistricts = [];
    for (const p of provinces) {
      allDistricts = allDistricts.concat(rwanda.getDistricts(p));
    }
    // Sort districts alphabetically
    allDistricts.sort();
    res.json(allDistricts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get province by district
router.get('/province-by-district', (req, res) => {
  const { district } = req.query;
  if (!district) return res.status(400).json({ error: 'District is required' });
  const province = getProvinceByDistrict(district);
  if (!province) return res.status(404).json({ error: 'District not found' });
  res.json({ province });
});

// Get sectors for a district
router.get('/sectors', (req, res) => {
  try {
    const { district } = req.query;
    if (!district) return res.status(400).json({ error: 'District is required' });
    
    const province = getProvinceByDistrict(district);
    if (!province) return res.status(404).json({ error: 'District not found' });

    const sectors = rwanda.getSectors(province, district);
    res.json(sectors || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cells for a sector
router.get('/cells', (req, res) => {
  try {
    const { district, sector } = req.query;
    if (!district || !sector) return res.status(400).json({ error: 'District and Sector are required' });

    const province = getProvinceByDistrict(district);
    if (!province) return res.status(404).json({ error: 'District not found' });

    const cells = rwanda.getCells(province, district, sector);
    res.json(cells || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get villages for a cell
router.get('/villages', (req, res) => {
  try {
    const { district, sector, cell } = req.query;
    if (!district || !sector || !cell) return res.status(400).json({ error: 'District, Sector, and Cell are required' });

    const province = getProvinceByDistrict(district);
    if (!province) return res.status(404).json({ error: 'District not found' });

    const villages = rwanda.getVillages(province, district, sector, cell);
    res.json(villages || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
