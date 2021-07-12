const { MasterStore } = require('../models/storeModel');
const { Item } = require('../models/itemModel');
const { sendErrorResponse } = require('../utils/errorHandler');
const AppError = require('../utils/appError');

const getItemsFromMasterStore = async (req, res) => {
  try {
    let storeItems = await MasterStore.find().populate('itemId');

    items = storeItems.map(({ itemId: { name, _id: id }, quantity }) => ({ id, name, quantity }));

    res.json({
      totalQuantity: items.reduce((sum, { quantity }) => sum + quantity, 0),
      noOfItems: items.length,
      items: items
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const addItemToMasterStore = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    let item = await Item.findOne({ name });

    if (!item?._id) {
      item = await Item.create({ name });
    }

    const storeItem = await MasterStore.findOne({ itemId: item._id });

    if (storeItem) {
      throw new AppError('Item already found in store', 400);
    }

    await MasterStore.create({ itemId: item._id, quantity });

    res.status(201).json({
      message: 'Item added successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const deleteItemFromMasterStore = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const storeItem = await MasterStore.findOne({ itemId });

    if (!storeItem) {
      throw new AppError('Item not found in store', 400);
    }

    await MasterStore.findByIdAndDelete(storeItem.id);

    res.json({
      message: 'Item deleted successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const updateItemInMasterStore = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, quantity } = req.body;
    const storeItem = await MasterStore.findOne({ itemId });

    if (!storeItem) {
      throw new AppError('Item not found in store', 400);
    }

    if (name) {
      await Item.findByIdAndUpdate(itemId, { name }, {
        new: true,
        runValidators: true
      });
    }

    if (quantity !== null || quantity !== undefined) {
      await MasterStore.findByIdAndUpdate(storeItem.id, { quantity }, {
        new: true,
        runValidators: true
      });
    }

    res.json({
      message: 'Item updated successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  addItemToMasterStore,
  deleteItemFromMasterStore,
  getItemsFromMasterStore,
  updateItemInMasterStore
};
