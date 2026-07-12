const { Sequelize } = require('sequelize');
const db = require('./models');

const labTechs = [
  { name: 'Evodie Uwibambe', phone_number: '0786315713' },
  { name: 'Mukakigeri clementine', phone_number: '0781100215' },
  { name: 'Jovia Kamatenesi', phone_number: '0788616827' },
  { name: 'Lumumba Esther', phone_number: '0788241542' },
  { name: 'Ingabire blandine', phone_number: '0782279977' },
  { name: 'DUSHIME Hyacinthe', phone_number: '0786082356' },
  { name: 'MBURANUMWE Jean Claude', phone_number: '0788694756' },
  { name: 'Gahirwa j.Baptiste', phone_number: '0785508824' },
  { name: 'Muco Ady Sardou', phone_number: '0787544796' },
  { name: 'Ndizihiwe Gihozo Divine', phone_number: '0783415009' },
  { name: 'Gahungu Ferdinand', phone_number: '0783933450' },
  { name: 'Murerwa Lydia', phone_number: '0732800217' }, // taking first number
  { name: 'Kabera Angelique', phone_number: '0785141778' },
  { name: 'Claire MUREKATETE', phone_number: '0786947923' },
  { name: 'Ndihokubwayo Edison', phone_number: '0788490993' }, // taking first number
  { name: 'Uwurugwiro Raïssa', phone_number: '0789519523' },
  { name: 'Mapenzi carine', phone_number: '0788720880' }, // taking first number
  { name: 'Vestine Uwitugabiye', phone_number: '0790815932' },
  { name: 'Laban KWIZERA', phone_number: '0788930123' },
  { name: 'Niyonteze Ghislain', phone_number: '0788863323' },
  { name: 'Josiane Umubyeyi', phone_number: '0788833704' },
  { name: 'Musengimana Thabita', phone_number: '0788737885' }, // appended 0
  { name: 'Mujawingoma Liberathe', phone_number: '0783677509' },
  { name: 'Reuben', phone_number: '0782307562' },
  { name: 'Garard', phone_number: '0788880404' },
  { name: 'Valens', phone_number: '0788293425' },
  { name: 'Fidele', phone_number: '0788599029' }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await db.sequelize.authenticate();
    console.log('Connected successfully.');

    let addedCount = 0;
    for (const tech of labTechs) {
      const [record, created] = await db.LabTechnician.findOrCreate({
        where: { phone_number: tech.phone_number },
        defaults: { name: tech.name }
      });
      if (created) {
        console.log(`+ Added: ${tech.name} (${tech.phone_number})`);
        addedCount++;
      } else {
        console.log(`- Skipped (already exists): ${tech.name} (${tech.phone_number})`);
      }
    }
    
    console.log(`\nFinished! Added ${addedCount} new lab technicians.`);
  } catch (error) {
    console.error('Error seeding lab technicians:', error);
  } finally {
    process.exit();
  }
}

seed();
