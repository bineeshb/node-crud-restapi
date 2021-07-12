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
  .get(requireAuth(['user']), getItemsFromUserStore)
  .post(requireAuth(['user']), addItemToUserStore);

userStoreRouter.route('/:itemId')
  .put(requireAuth(['user']), updateItemInUserStore)
  .delete(requireAuth(['user']), deleteItemFromUserStore);

module.exports = { userStoreRouter };
