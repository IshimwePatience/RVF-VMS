const { Daro } = require('./models');

const daros = [
  { full_names: 'SIBOMANA Seth', phone_number: '0783781560', district: 'Bugesera' },
  { full_names: 'Mukamwezi Adrolatha', phone_number: '0788620528', district: 'Burera' },
  { full_names: 'Dushimimana Monique', phone_number: '0783530710', district: 'Gakenke' },
  { full_names: 'BIZIMANA Jean Paul', phone_number: '0788820561', district: 'Gasabo' },
  { full_names: 'HITIYAREMYE Valens', phone_number: '0783038763', district: 'Gatsibo' },
  { full_names: 'GASHIRABAKE Isidore', phone_number: '0788561263', district: 'Gicumbi' },
  { full_names: 'MUNEZERO Clarisse', phone_number: '0788476681', district: 'Gisagara' },
  { full_names: 'KALISA Arstide', phone_number: '0788682839', district: 'Huye' },
  { full_names: 'NZAYISENGA Roland', phone_number: '0788735876', district: 'Kamonyi' },
  { full_names: 'NYIRIMANZI THEONESTE', phone_number: '0788825467', district: 'Karongi' },
  { full_names: 'MUHAYIMANA Cyprien', phone_number: '0788552099', district: 'Kayonza' },
  { full_names: 'MUTETIWABO Peledicanda', phone_number: '0788467021', district: 'Kicukiro' },
  { full_names: 'Nsengimana Emmanuel', phone_number: '0788944790', district: 'Kirehe' },
  { full_names: 'Kubwimana Patricie', phone_number: '0788863364', district: 'Muhanga' },
  { full_names: 'NSENGIYUMVA Jean Bosco', phone_number: '0788613811', district: 'Musanze' },
  { full_names: 'Rwaganje Gilbert', phone_number: '0788549084', district: 'Ngoma' },
  { full_names: 'HATANGIMANA Jean Pierre', phone_number: '0782551505', district: 'Ngororero' },
  { full_names: 'SHINGIRO Eugene', phone_number: '0783276518', district: 'Nyabihu' },
  { full_names: 'Hagumimana Damascene', phone_number: '0722603510', district: 'Nyagatare' },
  { full_names: 'KARANGWA Pascal', phone_number: '0784146314', district: 'Nyamagabe' },
  { full_names: 'SINDAYIHEBA Felix', phone_number: '0788762945', district: 'Nyamasheke' },
  { full_names: 'Evode Mudahemuka', phone_number: '0783295532', district: 'Nyanza' },
  { full_names: 'KAYIHURA Vincent', phone_number: '0788574953', district: 'Nyarugenge' },
  { full_names: 'NDAGIJIMANA Vincent', phone_number: '0786346762', district: 'Nyaruguru' },
  { full_names: 'KALISA Robert', phone_number: '0788324049', district: 'Rubavu' },
  { full_names: 'RUGWIZANGOGA Dieudonné', phone_number: '0788532885', district: 'Ruhango' },
  { full_names: 'MUKAGASANA Alphonsine', phone_number: '0783525408', district: 'Rulindo' },
  { full_names: 'NIYONSABA Oscar', phone_number: '0788699333', district: 'Rusizi' },
  { full_names: 'NIYIGENA Loïs', phone_number: '0788773417', district: 'Rutsiro' },
  { full_names: 'NIYITANGA Jean de Dieu', phone_number: '0788629884', district: 'Rwamagana' }
];

async function seed() {
  try {
    for (const d of daros) {
      // Clean phone number (remove spaces)
      const phone_number = d.phone_number.replace(/\s+/g, '');
      
      // Capitalize district (e.g. KAMONYI -> Kamonyi, Bugesera -> Bugesera)
      const district = d.district.charAt(0).toUpperCase() + d.district.slice(1).toLowerCase();
      
      await Daro.findOrCreate({
        where: { phone_number: phone_number },
        defaults: {
          full_names: d.full_names,
          phone_number: phone_number,
          district: district
        }
      });
    }
    console.log('DAROs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DAROs:', error);
    process.exit(1);
  }
}

seed();
