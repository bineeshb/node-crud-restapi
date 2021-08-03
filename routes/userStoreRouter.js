const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  checkUserStoreAndItem,
  sellItemCompletely,
  getUserStoreItems,
  sellItemQuantities
} = require('../controllers/userStoreController');

const userStoreRouter = Router();

userStoreRouter
  .get('/', requireAuth(['user']), getUserStoreItems)
  .put('/:itemId/sell', [ requireAuth(['user']), checkUserStoreAndItem ], sellItemQuantities)
  .delete('/:itemId', [ requireAuth(['user']), checkUserStoreAndItem ], sellItemCompletely);

module.exports = { userStoreRouter };
