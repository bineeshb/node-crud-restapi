const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  addItemToMasterStore,
  deleteItemFromMasterStore,
  getItemsFromMasterStore,
  updateItemInMasterStore
} = require('../controllers/masterStoreController');

const masterStoreRouter = Router();

masterStoreRouter.route('/')
  .get(requireAuth, getItemsFromMasterStore)
  .post(requireAuth, addItemToMasterStore);

masterStoreRouter.route('/:itemId')
  .put(requireAuth, updateItemInMasterStore)
  .delete(requireAuth, deleteItemFromMasterStore);

module.exports = { masterStoreRouter };
