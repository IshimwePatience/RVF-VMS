const { Transfer, StockInventory, sequelize } = require('../models');

exports.getTransfers = async (user, type) => {
  const where = type === 'incoming' 
    ? { to_stock_id: user.stock_id } 
    : { from_stock_id: user.stock_id };
  return await Transfer.findAll({ where });
};

exports.confirmDelivery = async (id, user) => {
  return await sequelize.transaction(async (t) => {
    const transfer = await Transfer.findByPk(id, { transaction: t });
    if (!transfer || transfer.to_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
    if (transfer.status !== 'In Transit') throw new Error('Transfer is already processed');

    let inventory = await StockInventory.findOne({
      where: { stock_id: user.stock_id, batch_id: transfer.batch_id },
      transaction: t
    });

    if (inventory) {
      inventory.quantity_available += transfer.quantity;
      await inventory.save({ transaction: t });
    } else {
      await StockInventory.create({
        stock_id: user.stock_id,
        batch_id: transfer.batch_id,
        quantity_available: transfer.quantity
      }, { transaction: t });
    }

    transfer.status = 'Completed';
    transfer.received_by = user.id;
    transfer.received_at = new Date();
    await transfer.save({ transaction: t });

    return transfer;
  });
};