const { Sequelize } = require('sequelize');
const db = require('./models');

const vetData = [
  { name: "RWIBUTSO Fidele", phone: "0784032690", district: "Gatsibo" },
  { name: "HARERIMANA Innocent", phone: "0798487435", district: "Gatsibo" },
  { name: "TWAGIRINSHUTI Jean de Dieu", phone: "0788220850", district: "Gatsibo" },
  { name: "Muyoboke Isaac Patrick", phone: "0789001779", district: "Muhanga" },
  { name: "Tuyishimire Felix", phone: "0787424143", district: "Muhanga" },
  { name: "Uhiriweanimana Bernard", phone: "0787086751", district: "Muhanga" },
  { name: "Niyigena Charlotte", phone: "0782548057", district: "Ruhango" },
  { name: "Karageya Kasim", phone: "0785616409", district: "Ruhango" },
  { name: "Kubwimana Fraterne", phone: "0780087586", district: "Ruhango" },
  { name: "INGABIRE EMMANUEL", phone: "0788601871", district: "Kamonyi" },
  { name: "SHYAKA DIEUDONNE", phone: "0787610086", district: "Kamonyi" },
  { name: "BISUBIZO EDOUARD", phone: "0789882656", district: "Kamonyi" },
  { name: "NSENGIYUMVA Jean Claude", phone: "0788848192", district: "Burera" },
  { name: "KAREMERA Lodrigue", phone: "078125396", district: "Burera" },
  { name: "MUVANDIMWE Placide", phone: "0781288564", district: "Burera" },
  { name: "MUYAMBERE Felicien", phone: "0788800287", district: "Gakenke" },
  { name: "MUNYEMBABAZI Slyvus", phone: "0781297347", district: "Gakenke" },
  { name: "MUDAHERANWA Viateur", phone: "0783628083", district: "Gakenke" },
  { name: "Nyirimanzi Innocent", phone: "0788646722", district: "Nyarugenge" },
  { name: "Niyigena Deborah", phone: "0784223167", district: "Nyarugenge" },
  { name: "Mpagazekubwayo Celestin", phone: "0787343157", district: "Nyarugenge" },
  { name: "MUREKEZI Desire", phone: "0786308382", district: "Nyamagabe" },
  { name: "NIYOMWUNGIJI Emmanuel", phone: "0788837004", district: "Nyamagabe" },
  { name: "SIBOMANA Thomas", phone: "0734120534", district: "Nyamagabe" },
  { name: "Mushimiyimana Speciose", phone: "0782162591", district: "Nyaruguru" },
  { name: "Habarugira Marc", phone: "0788564052", district: "Nyaruguru" },
  { name: "Dusengimana Phenias", phone: "0788741876", district: "Nyaruguru" },
  { name: "Ndaruhutse Landuard", phone: "0785626753", district: "Kayonza" },
  { name: "Vumiliya Bonaventure", phone: "0783296050", district: "Kayonza" },
  { name: "Bikorimana Jean Pierre", phone: "0785253112", district: "Kayonza" },
  { name: "Niyonsenga Prosperine", phone: "0783578099", district: "Bugesera" },
  { name: "Habimana Emmanuel", phone: "0782412110", district: "Bugesera" },
  { name: "Ntirenganya Theogene", phone: "0781521895", district: "Bugesera" },
  { name: "HABUMUGISHA Damascene", phone: "0781710558", district: "Nyanza" },
  { name: "NKUNDAKWIZERA Pierre Celestin", phone: "0783773446", district: "Nyanza" },
  { name: "NTAKIRUTIMANA Fidel", phone: "0781191544", district: "Nyanza" },
  { name: "Hakizimana Alex", phone: "0785063191", district: "Huye" },
  { name: "Dushimiyimana Adrien", phone: "0725605139", district: "Huye" },
  { name: "Mbonimana Hermogene", phone: "0788828356", district: "Huye" },
  { name: "BITWAYIKI JEAN De Dieu", phone: "0783444683", district: "Gisagara" },
  { name: "Nsengiyumva Jerome", phone: "0788899832", district: "Gisagara" },
  { name: "Ingabire Josiane", phone: "0790698891", district: "Gisagara" },
  { name: "Hakizimana Prosper", phone: "0781401500", district: "Ngoma" },
  { name: "Bizumuremyi Alphonse", phone: "0788983655", district: "Ngoma" },
  { name: "Uwimana Claudette", phone: "0780501498", district: "Ngoma" },
  { name: "Niyitegeka Fulgence", phone: "0788460884", district: "Kirehe" },
  { name: "BARAYAGWIZA Jean Baptiste", phone: "0782447891", district: "Kirehe" },
  { name: "Hakizimana Jean D'Amour", phone: "0782899018", district: "Kirehe" },
  { name: "NSABIMANA THEOBARD", phone: "0781487540", district: "Rusizi" },
  { name: "KAYENZI Jean Nepo", phone: "0787590700", district: "Rusizi" },
  { name: "HAKIZIMANA ZACHEE", phone: "0788775738", district: "Rusizi" },
  { name: "Karikumana Venuste", phone: "0781154917", district: "Ngororero" },
  { name: "Nsabimana Theogene", phone: "0782796228", district: "Ngororero" },
  { name: "Habimana Nicodem", phone: "0783188258", district: "Ngororero" },
  { name: "Niyonzima Daniel", phone: "0781623778", district: "Rwamagana" },
  { name: "Ngabonziza Erneste", phone: "0781702476", district: "Rwamagana" },
  { name: "Munyemana Tite", phone: "0783670733", district: "Rwamagana" },
  { name: "TUYISHIME Fidele", phone: "0786324931", district: "Nyabihu" },
  { name: "NGAYUWAHO", phone: "0788813982", district: "Nyabihu" },
  { name: "NSENGIYUMVA Jean Pierre", phone: "0786717207", district: "Nyabihu" },
  { name: "Hakizimana Alex", phone: "0785063191", district: "Huye" },
  { name: "Dushimiyimana Adrien", phone: "0725605139", district: "Huye" },
  { name: "Mbonimana Hermogene", phone: "0788828356", district: "Huye" },
  { name: "NTIYEGUKA Martin", phone: "0784059008", district: "Rutsiro" },
  { name: "HABIMANA Habibu", phone: "0788339177", district: "Rutsiro" },
  { name: "TWIZERIMANA Abdon", phone: "0785490120", district: "Rutsiro" },
  { name: "Dr UMUTONI Odille", phone: "0786520349", district: "Rulindo" },
  { name: "UWAJEZA Anasi", phone: "0788777501", district: "Rulindo" },
  { name: "NSENGIMANA Deu", phone: "0782157238", district: "Rulindo" },
  { name: "Ngiruwonsanga venuste", phone: "0786037900", district: "Ngoma" },
  { name: "Ndagijimana Theodomire", phone: "0782156898", district: "Ngoma" },
  { name: "Nsabimana Lambert", phone: "0782204978", district: "Ngoma" },
  { name: "UWAMBAJE Marie Therese", phone: "0788423371", district: "Nyamasheke" },
  { name: "NDAYISHIMYE Elisa", phone: "0787719856", district: "Nyamasheke" },
  { name: "GUSENGA Fabien", phone: "0788241550", district: "Nyamasheke" },
  { name: "GUMYUSENGE Eric", phone: "0785612550", district: "Karongi" },
  { name: "DIRUSHABAGABO J. Pierre", phone: "0784056815", district: "Karongi" },
  { name: "SHABANI Jean Baptiste", phone: "0783387812", district: "Karongi" },
  { name: "BITWAYIKI JEAN De Dieu", phone: "0783444683", district: "Gisagara" },
  { name: "Nsengiyumva Jerome", phone: "0788899832", district: "Gisagara" },
  { name: "Ingabire Josiane", phone: "0790698891", district: "Gisagara" },
  { name: "MAHANGO Jean Pierre", phone: "0787088328", district: "Kicukiro" },
  { name: "Rwakabare Jean Pierre", phone: "0788652361", district: "Kicukiro" },
  { name: "Rwakibibi Ildephonse", phone: "0788725455", district: "Kicukiro" },
  { name: "Mbarubukeye Faustin", phone: "0788777189", district: "Musanze" },
  { name: "Valentin Nshimyumukiza", phone: "0792323730", district: "Musanze" },
  { name: "Nkuranyamabo J. Pierre", phone: "0782405960", district: "Musanze" },
  { name: "MUREKEZI Desire", phone: "0786308482", district: "Nyamagabe" },
  { name: "NIYOMWUNGILI Emmanuel", phone: "0788837004", district: "Nyamagabe" },
  { name: "SIBOMANA Thomas", phone: "0734120534", district: "Nyamagabe" },
  { name: "IZAMBAMBA Daniel", phone: "0785080233", district: "Musanze" },
  { name: "HABIMANA Gad", phone: "0781624050", district: "Musanze" },
  { name: "NTIRANDEKURA Elie", phone: "0791083147", district: "Musanze" },
  { name: "Niyomugabo pascal", phone: "0788812480", district: "Rutsiro" },
  { name: "Bizimana Alex", phone: "0780717790", district: "Rutsiro" },
  { name: "Nshimiyimana Anicet (Mukung)", phone: "0788758213", district: "Rutsiro" },
  { name: "Ngongo Emmanuel", phone: "0782807650", district: "Nyagatare" },
  { name: "Nshimiyimana Eric", phone: "0798004965", district: "Nyagatare" },
  { name: "Harerimana Solomon", phone: "0788995557", district: "Nyagatare" },
  { name: "HABIMANA Dieudonne", phone: "0788234387", district: "Nyamagabe" },
  { name: "GATARI Samuel", phone: "0780803065", district: "Nyamagabe" },
  { name: "NZAYITURIKI Damas", phone: "0783948705", district: "Nyamagabe" },
  { name: "TUYIZERE Tibert", phone: "0788414452", district: "Gicumbi" },
  { name: "ABIYINGOMA Eric", phone: "0788814452", district: "Gicumbi" },
  { name: "MUKANKUSI Esperance", phone: "0788266047", district: "Gicumbi" },
  { name: "IRAKIZA Patrick", phone: "0789030520", district: "Rubavu" },
  { name: "MASENGESHO Esperance", phone: "0782237329", district: "Rubavu" },
  { name: "UWIRINGIYIMANA Emmanuel", phone: "0787584673", district: "Rubavu" },
  { name: "Iyakaye Robert", phone: "0785047799", district: "Gasabo" },
  { name: "Nshimiyimana J Pierre", phone: "0783287432", district: "Gasabo" },
  { name: "Benjamin Ndayishimiye", phone: "0789740568", district: "Gasabo" }
];

async function seedVeterinaries() {
  console.log("Connecting to database...");
  await db.sequelize.authenticate();
  console.log("Connected.");

  let added = 0;
  let skipped = 0;

  for (let data of vetData) {
    let rawName = data.name.replace(/^\d+\.\s*/, '').trim();
    let rawPhone = data.phone.replace(/[^\d]/g, '').trim();
    if (rawPhone.length === 9 && !rawPhone.startsWith('0')) {
      rawPhone = '0' + rawPhone;
    }
    
    let email = `${rawPhone}@vet.gov.rw`;
    let district = data.district.trim().charAt(0).toUpperCase() + data.district.trim().slice(1).toLowerCase();

    const existing = await db.Veterinary.findOne({ where: { phone_number: rawPhone } });
    if (!existing) {
      // Find district stock using the exact naming convention from seed_stocks.js ("DistrictName District")
      let stock = await db.Stock.findOne({ where: { name: district + ' District' } });
      
      // If still not found, search with wildcards just in case
      if (!stock) {
        stock = await db.Stock.findOne({ 
          where: { 
            name: { [db.Sequelize.Op.iLike]: `%${district}%` }
          }
        });
      }

      // If absolutely no stock matches, link to the national central stock so it doesn't fail the not-null constraint
      if (!stock) {
        stock = await db.Stock.findOne({ where: { is_central: true } });
      }

      await db.Veterinary.create({
        name: rawName,
        phone_number: rawPhone,
        district: district,
        email: email,
        stock_id: stock ? stock.id : null,
        is_self_registered: false
      });
      console.log(`Added: ${rawName} (${rawPhone}) - ${district}`);
      added++;
    } else {
      console.log(`Skipped (already exists): ${rawName} (${rawPhone})`);
      skipped++;
    }
  }

  console.log(`\nFinished seeding. Added: ${added}, Skipped: ${skipped}`);
  process.exit(0);
}

seedVeterinaries().catch(err => {
  console.error("Error seeding veterinaries:", err);
  process.exit(1);
});
