const fs = require('fs');
const path = require('path');

const entities = ['vaccine', 'supplier', 'stock'];

entities.forEach(entity => {
  const servicePath = path.join(__dirname, 'services', `${entity}.service.js`);
  const controllerPath = path.join(__dirname, 'controllers', `${entity}.controller.js`);
  const routePath = path.join(__dirname, 'routes', `${entity}.routes.js`);

  const CapitalEntity = entity.charAt(0).toUpperCase() + entity.slice(1);

  // Service
  let serviceContent = fs.readFileSync(servicePath, 'utf8');
  if (!serviceContent.includes(`update${CapitalEntity}`)) {
    serviceContent += `
exports.update${CapitalEntity} = async (id, data) => {
  const { ${CapitalEntity} } = require('../models');
  const item = await ${CapitalEntity}.findByPk(id);
  if (!item) throw new Error('${CapitalEntity} not found');
  return await item.update(data);
};
exports.delete${CapitalEntity} = async (id) => {
  const { ${CapitalEntity} } = require('../models');
  const item = await ${CapitalEntity}.findByPk(id);
  if (!item) throw new Error('${CapitalEntity} not found');
  await item.destroy();
  return true;
};
`;
    fs.writeFileSync(servicePath, serviceContent);
  }

  // Controller
  let controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (!controllerContent.includes(`update${CapitalEntity}`)) {
    controllerContent += `
exports.update${CapitalEntity} = async (req, res) => {
  try {
    const item = await ${entity}Service.update${CapitalEntity}(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
exports.delete${CapitalEntity} = async (req, res) => {
  try {
    await ${entity}Service.delete${CapitalEntity}(req.params.id);
    res.json({ message: '${CapitalEntity} deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
`;
    fs.writeFileSync(controllerPath, controllerContent);
  }

  // Routes
  let routeContent = fs.readFileSync(routePath, 'utf8');
  if (!routeContent.includes(`router.put`)) {
    routeContent = routeContent.replace('module.exports = router;', `
router.put('/:id', authenticate, requireCentralStock, ${entity}Controller.update${CapitalEntity});
router.delete('/:id', authenticate, requireCentralStock, ${entity}Controller.delete${CapitalEntity});

module.exports = router;
`);
    fs.writeFileSync(routePath, routeContent);
  }
});

// Inventory
const invServicePath = path.join(__dirname, 'services', 'inventory.service.js');
let invSvc = fs.readFileSync(invServicePath, 'utf8');
if (!invSvc.includes('deleteInventory')) {
  invSvc += `
exports.deleteInventory = async (id, user) => {
  const { StockInventory, Batch } = require('../models');
  if (!user.is_central && user.role !== 'Admin') throw new Error('Not authorized');
  const inventory = await StockInventory.findByPk(id);
  if (!inventory) throw new Error('Inventory not found');
  const batchId = inventory.batch_id;
  await inventory.destroy();
  if (batchId) {
    await Batch.destroy({ where: { id: batchId } });
  }
  return true;
};
`;
  fs.writeFileSync(invServicePath, invSvc);
}

const invCtrlPath = path.join(__dirname, 'controllers', 'inventory.controller.js');
let invCtrl = fs.readFileSync(invCtrlPath, 'utf8');
if (!invCtrl.includes('deleteInventory')) {
  invCtrl += `
exports.deleteInventory = async (req, res) => {
  try {
    await inventoryService.deleteInventory(req.params.id, req.user);
    res.json({ message: 'Inventory deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
`;
  fs.writeFileSync(invCtrlPath, invCtrl);
}

const invRoutePath = path.join(__dirname, 'routes', 'inventory.routes.js');
let invRoute = fs.readFileSync(invRoutePath, 'utf8');
if (!invRoute.includes('router.delete')) {
  invRoute = invRoute.replace('module.exports = router;', `
router.delete('/:id', authenticate, requireCentralStock, inventoryController.deleteInventory);

module.exports = router;
`);
  fs.writeFileSync(invRoutePath, invRoute);
}

console.log("CRUD Patched");
