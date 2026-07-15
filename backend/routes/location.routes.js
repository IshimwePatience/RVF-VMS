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
    let district = req.query.district || req.query['district[]'];
    if (!district) return res.status(400).json({ error: 'District is required' });
    
    if (!Array.isArray(district)) district = [district];

    let allSectors = [];
    for (const d of district) {
      const province = getProvinceByDistrict(d);
      if (province) {
        const sectors = rwanda.getSectors(province, d);
        if (sectors) allSectors = allSectors.concat(sectors);
      }
    }
    
    allSectors = [...new Set(allSectors)].sort();
    res.json(allSectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cells for a sector
router.get('/cells', (req, res) => {
  try {
    let district = req.query.district || req.query['district[]'];
    let sector = req.query.sector || req.query['sector[]'];
    if (!district || !sector) return res.status(400).json({ error: 'District and sector are required' });

    if (!Array.isArray(district)) district = [district];
    if (!Array.isArray(sector)) sector = [sector];

    let allCells = [];
    for (const d of district) {
      const province = getProvinceByDistrict(d);
      if (province) {
        for (const s of sector) {
          try {
            const cells = rwanda.getCells(province, d, s);
            if (cells) allCells = allCells.concat(cells);
          } catch (e) {
            // Ignore error if sector doesn't belong to district
          }
        }
      }
    }

    allCells = [...new Set(allCells)].sort();
    res.json(allCells);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get villages for a cell
router.get('/villages', (req, res) => {
  try {
    let district = req.query.district || req.query['district[]'];
    let sector = req.query.sector || req.query['sector[]'];
    let cell = req.query.cell || req.query['cell[]'];
    
    if (!district || !sector || !cell) return res.status(400).json({ error: 'District, sector, and cell are required' });

    if (!Array.isArray(district)) district = [district];
    if (!Array.isArray(sector)) sector = [sector];
    if (!Array.isArray(cell)) cell = [cell];

    let allVillages = [];
    for (const d of district) {
      const province = getProvinceByDistrict(d);
      if (province) {
        for (const s of sector) {
          for (const c of cell) {
            try {
              const villages = rwanda.getVillages(province, d, s, c);
              if (villages) allVillages = allVillages.concat(villages);
            } catch (e) {
              // Ignore error if mismatch
            }
          }
        }
      }
    }

    allVillages = [...new Set(allVillages)].sort();
    res.json(allVillages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
