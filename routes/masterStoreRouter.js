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
  .put(requireAuth(['admin']), updateItemInMasterStore)
  .delete(requireAuth(['admin']), deleteItemFromMasterStore);

module.exports = { masterStoreRouter };
