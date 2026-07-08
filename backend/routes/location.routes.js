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

// Get all districts
router.get('/districts', (req, res) => {
  try {
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
