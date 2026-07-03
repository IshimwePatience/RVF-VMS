const { sequelize, User, Stock } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });
  
  const centralStock = await Stock.create({
    name: 'National Central Stock',
    is_central: true,
  });

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('admin123', salt);

  await User.create({
    username: 'admin',
    email: 'ishimwepatience102@gmail.com',
    password_hash,
    must_change_password: false,
    stock_id: centralStock.id,
    role: 'Admin'
  });

  console.log('Database seeded with admin user (admin / admin123) and Central Stock.');
  process.exit(0);
}

seed();
