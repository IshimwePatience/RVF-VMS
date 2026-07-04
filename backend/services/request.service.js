const { Request, Transfer, StockInventory, Stock, sequelize } = require('../models');

exports.createRequest = async (data, user) => {
  const userStock = await Stock.findByPk(user.stock_id);
  if (!userStock.parent_stock_id) throw new Error('Central stock cannot request vaccines');

  return await Request.create({
    requesting_stock_id: user.stock_id,
    parent_stock_id: userStock.parent_stock_id,
    vaccine_id: data.vaccine_id,
    batch_id: data.batch_id,
    requested_quantity: data.requested_quantity,
    requested_by: user.id
  });
};

exports.getRequests = async (user, type) => {
  const { Vaccine, Batch, Stock } = require('../models');
  const where = type === 'incoming' 
    ? { parent_stock_id: user.stock_id } 
    : { requesting_stock_id: user.stock_id };
  return await Request.findAll({ 
    where,
    include: [
      { model: Vaccine },
      { model: Batch },
      { model: Stock, as: 'RequestingStock' }
    ],
    order: [['createdAt', 'DESC']]
  });
};

exports.approveRequest = async (id, user, approved_quantity, note) => {
  return await sequelize.transaction(async (t) => {
    const request = await Request.findByPk(id, { transaction: t });
    if (!request || request.parent_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
    if (request.status !== 'Pending') throw new Error('Request is already processed');

    const final_quantity = approved_quantity !== undefined ? parseInt(approved_quantity, 10) : request.requested_quantity;

    const inventory = await StockInventory.findOne({
      where: { stock_id: user.stock_id, batch_id: request.batch_id },
      transaction: t
    });

    if (!inventory || inventory.quantity_available < final_quantity) {
      throw new Error('Insufficient stock available');
    }

    inventory.quantity_available -= final_quantity;
    await inventory.save({ transaction: t });

    request.requested_quantity = final_quantity; // Update to actual approved amount
    request.status = 'Approved';
    request.reviewed_by = user.id;
    if (note) request.notes = note;
    await request.save({ transaction: t });

    const transfer = await Transfer.create({
      from_stock_id: user.stock_id,
      to_stock_id: request.requesting_stock_id,
      batch_id: request.batch_id,
      quantity: final_quantity,
      request_id: request.id,
      shipped_by: user.id
    }, { transaction: t });

    return { request, transfer };
  });
};

exports.rejectRequest = async (id, user, note) => {
  const request = await Request.findByPk(id);
  if (!request || request.parent_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
  if (request.status !== 'Pending') throw new Error('Request is already processed');
  if (!note || note.trim() === '') throw new Error('Rejection note is required');

  request.status = 'Rejected';
  request.reviewed_by = user.id;
  request.notes = note;
  await request.save();

  return request;
};

exports.deleteRequest = async (id, user) => {
  const request = await Request.findByPk(id);
  if (!request || request.requesting_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
  if (request.status !== 'Pending') throw new Error('Can only cancel pending requests');
  await request.destroy();
  return true;
};