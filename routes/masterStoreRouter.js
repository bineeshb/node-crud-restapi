const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  addMasterStoreItem,
  buyMasterStoreItem,
  deleteMasterStoreItem,
  getMasterStoreItems,
  updateMasterStoreItem
} = require('../controllers/masterStoreController');

const masterStoreRouter = Router();

masterStoreRouter.route('/')
  .get(requireAuth(), getMasterStoreItems)
  .post(requireAuth(['admin']), addMasterStoreItem);

masterStoreRouter.route('/:itemId')
  .all(requireAuth(['admin']))
  .put(updateMasterStoreItem)
  .delete(deleteMasterStoreItem);

masterStoreRouter.post('/:itemId/buy', requireAuth(['user']), buyMasterStoreItem)

module.exports = { masterStoreRouter };
