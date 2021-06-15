const { Item } = require('../models/detailsModel');
const { sendErrorResponse } = require('../utils/errorHandler');

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
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

module.exports = {
  addItem,
  getItems
};