const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  checkUserStoreAndItem,
  addItemToUserStore,
  deleteItemFromUserStore,
  getItemsFromUserStore,
  updateItemInUserStore
} = require('../controllers/userStoreController');

const userStoreRouter = Router();

userStoreRouter.route('/')
  .all(requireAuth(['user']))
  .get(getItemsFromUserStore)
  .post(addItemToUserStore);

userStoreRouter.route('/:itemId')
  .all([ requireAuth(['user']), checkUserStoreAndItem ])
  .put(updateItemInUserStore)
  .delete(deleteItemFromUserStore);

module.exports = { userStoreRouter };
