const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

const routes = {
  'user.routes.js': `const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireAdmin, userController.createUser);
router.get('/', authenticate, requireAdmin, userController.getUsers);

module.exports = router;`,

  'stock.routes.js': `const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireAdmin, stockController.createStock);
router.get('/', authenticate, stockController.getStocks);

module.exports = router;`,

  'supplier.routes.js': `const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireCentralStock, supplierController.createSupplier);
router.get('/', authenticate, requireCentralStock, supplierController.getSuppliers);

module.exports = router;`,

  'vaccine.routes.js': `const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccine.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireCentralStock, vaccineController.createVaccine);
router.get('/', authenticate, vaccineController.getVaccines);

module.exports = router;`,

  'inventory.routes.js': `const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/receive', authenticate, requireCentralStock, inventoryController.receiveCentralStock);
router.get('/', authenticate, inventoryController.getInventory);
router.post('/exchange-rate', authenticate, requireCentralStock, inventoryController.setExchangeRate);

module.exports = router;`,

  'request.routes.js': `const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, requestController.createRequest);
router.get('/', authenticate, requestController.getRequests);
router.post('/:id/approve', authenticate, requestController.approveRequest);

module.exports = router;`,

  'transfer.routes.js': `const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, transferController.getTransfers);
router.post('/:id/confirm', authenticate, transferController.confirmDelivery);

module.exports = router;`,

  'report.routes.js': `const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.get('/financial', authenticate, requireCentralStock, reportController.getFinancialReport);

module.exports = router;`
};

for (const [name, content] of Object.entries(routes)) {
  fs.writeFileSync(path.join(routesDir, name), content);
}

// Update server.js
const serverFile = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverFile, 'utf8');

const routeImports = `
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const stockRoutes = require('./routes/stock.routes');
const supplierRoutes = require('./routes/supplier.routes');
const vaccineRoutes = require('./routes/vaccine.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const requestRoutes = require('./routes/request.routes');
const transferRoutes = require('./routes/transfer.routes');
const reportRoutes = require('./routes/report.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/reports', reportRoutes);
`;

serverContent = serverContent.replace(/const authRoutes = require\('\.\/routes\/auth\.routes'\);\napp\.use\('\/api\/auth', authRoutes\);/, routeImports);

fs.writeFileSync(serverFile, serverContent);

console.log('Routes generated and server.js updated');
