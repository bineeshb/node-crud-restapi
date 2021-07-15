const UserStore = require('../models/userStoreModel');
const AppError = require('../utils/appError');
const { sendErrorResponse } = require('../utils/errorHandler');

const isItemInList = (items, findItemId) => items.some(({ itemId }) => itemId.equals(findItemId));
const getRemainingItems = (items, excludeItemId) => items.filter(({ itemId }) => !itemId.equals(excludeItemId));

const checkUserStoreAndItem = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;
    const userStore = await UserStore.findOne({ userId });

    if (!userStore) {
      throw new AppError(`User doesn't have a store`, 400);
    }

    if (!isItemInList(userStore.items, itemId)) {
      throw new AppError('Item not found in User store', 400);
    }

    req.params.userStore = userStore;
    next();
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const getItemsFromUserStore = async (req, res) => {
  try {
    const { userId } = req.params;
    const userStore = await UserStore.findOne({ userId }).populate('items.itemId');
    const items = userStore?.items
      ? userStore.items.map(({ itemId: { name, _id: id }, quantity }) => ({ id, name, quantity }))
      : [];

    res.json({
      totalQuantity: items.reduce((sum, { quantity }) => sum + quantity, 0),
      noOfItems: items.length,
      items
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const addItemToUserStore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemId, quantity } = req.body;
    const userStore = await UserStore.findOne({ userId });

    if (isItemInList(userStore.items, itemId)) {
      throw new AppError('Item already available in the User store', 400);
    }

    if (userStore) {
      const updatedDetails = {
        userId,
        items: [
          ...userStore.items,
          {
            itemId,
            quantity
          }
        ]
      };

      await UserStore.findByIdAndUpdate(userStore.id, updatedDetails);
    } else {
      await UserStore.create({
        userId,
        items: [{
          itemId,
          quantity
        }]
      });
    }

    res.status(201).json({
      message: 'Item added to store successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const deleteItemFromUserStore = async (req, res) => {
  try {
    const { itemId: deleteItemId, userId, userStore } = req.params;

    const updatedDetails = {
      userId,
      items: getRemainingItems(userStore.items, deleteItemId)
    };

    await UserStore.findByIdAndUpdate(userStore.id, updatedDetails, {
      new: true,
      runValidators: true
    });

    res.json({
      message: 'Item deleted from store successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const updateItemInUserStore = async (req, res) => {
  try {
    const { itemId: updateItemId, userId, userStore } = req.params;
    const { quantity } = req.body;

    const updatedDetails = {
      userId,
      items: [
        ...getRemainingItems(userStore.items, updateItemId),
        {
          itemId: updateItemId,
          quantity
        }
      ]
    };

    await UserStore.findByIdAndUpdate(userStore.id, updatedDetails, {
      new: true,
      runValidators: true
    });

    res.json({
      message: 'Item in store updated successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  checkUserStoreAndItem,
  addItemToUserStore,
  deleteItemFromUserStore,
  getItemsFromUserStore,
  updateItemInUserStore
};
