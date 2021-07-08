const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  addItemToUserStore,
  deleteItemFromUserStore,
  getItemsFromUserStore,
  updateItemInUserStore
} = require('../controllers/userStoreController');

const userStoreRouter = Router();

userStoreRouter.route('/')
  .get(requireAuth, getItemsFromUserStore)
  .post(requireAuth, addItemToUserStore);

userStoreRouter.route('/:itemId')
  .put(requireAuth, updateItemInUserStore)
  .delete(requireAuth, deleteItemFromUserStore);

module.exports = { userStoreRouter };
