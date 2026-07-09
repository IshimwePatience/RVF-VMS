const { Stock, sequelize } = require('./models');
const rwanda = require('rwanda-locations');

async function seedStocks() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected.');

    // 1. Find ZIPLINE stock
    const zipline = await Stock.findOne({ where: { name: 'ZIPLINE' } });
    if (!zipline) {
      console.error('Error: ZIPLINE stock not found. Please create it first.');
      process.exit(1);
    }
    
    console.log(`Found ZIPLINE stock with ID: ${zipline.id}`);

    const provinces = rwanda.getProvinces();
    let districtsCreated = 0;
    let sectorsCreated = 0;

    for (const province of provinces) {
      const districts = rwanda.getDistricts(province);
      if (!districts) continue;

      for (const district of districts) {
        // Create district stock
        const districtName = `${district} District`;
        console.log(`Creating ${districtName}...`);
        
        const districtStock = await Stock.create({
          name: districtName,
          is_central: false,
          is_endpoint: false,
          parent_stock_id: zipline.id,
          province,
          district
        });
        districtsCreated++;

        const sectors = rwanda.getSectors(province, district);
        if (!sectors) continue;

        // Create sector stocks for this district
        const sectorData = sectors.map(sector => ({
          name: `${sector} Sector`,
          is_central: false,
          is_endpoint: true,
          parent_stock_id: districtStock.id,
          province,
          district,
          sector
        }));

        await Stock.bulkCreate(sectorData);
        sectorsCreated += sectorData.length;
        console.log(`  -> Created ${sectorData.length} sectors for ${district}`);
      }
    }

    console.log(`\nSeed completed successfully!`);
    console.log(`Districts created: ${districtsCreated}`);
    console.log(`Sectors created: ${sectorsCreated}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed stocks:', error);
    process.exit(1);
  }
}

seedStocks();
