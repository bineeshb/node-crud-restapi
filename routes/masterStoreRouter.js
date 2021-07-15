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
  .get(requireAuth(), getItemsFromMasterStore)
  .post(requireAuth(['admin']), addItemToMasterStore);

masterStoreRouter.route('/:itemId')
  .all(requireAuth(['admin']))
  .put(updateItemInMasterStore)
  .delete(deleteItemFromMasterStore);

module.exports = { masterStoreRouter };
