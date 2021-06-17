const { Item } = require('../models/detailsModel');
const { sendErrorResponse } = require('../utils/errorHandler');

const getItems = async (req, res) => {
  try {
    const items = await Item.getItems();
    res.json(items);
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const addItem = async (req, res) => {
  try {
    const { name, count } = req.body;
    const items = await Item.create({ name, count });
    res.status(201).json(items);
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Item deleted successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const updateItem = async (req, res) => {
  try {
    const items = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(items);
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  addItem,
  deleteItem,
  getItems,
  updateItem
};