const UserStore = require('../models/userStoreModel');
const AppError = require('../utils/appError');
const { sendErrorResponse } = require('../utils/errorHandler');

const isItemInList = (items, findItemId) => items.some(({ itemId }) => itemId.equals(findItemId));

const checkUserStoreAndItem = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;
    const userStore = await UserStore.checkAndGetStore(userId);

    if (!isItemInList(userStore.items, itemId)) {
      throw new AppError('Item not found in User store', 400);
    }

    req.params.userStore = userStore;
    next();
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const getUserStoreItems = async (req, res) => {
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

const sellItemCompletely = async (req, res) => {
  try {
    const { itemId, userStore } = req.params;

    await UserStore.updateItemQuantity(userStore.id, itemId, 0);

    res.json({
      message: 'All quantities of the Item sold successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const sellItemQuantities = async (req, res) => {
  try {
    const { itemId, userStore } = req.params;
    const { quantity: sellQuantity } = req.body;
    const storeItem = userStore?.items?.length > 0
      ? userStore.items.find(({ itemId: availableItemId }) => availableItemId.equals(itemId))
      : null;

    if (storeItem && sellQuantity > storeItem.quantity) {
      throw new AppError('Requested quantity of the Item not available in the store', 400);
    }

    const quantity = storeItem.quantity - sellQuantity;

    await UserStore.updateItemQuantity(userStore.id, itemId, quantity);

    res.json({
      message: 'Requested quantity of the Item sold successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  checkUserStoreAndItem,
  sellItemCompletely,
  getUserStoreItems,
  sellItemQuantities
};
