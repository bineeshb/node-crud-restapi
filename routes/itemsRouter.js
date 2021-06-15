const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { addItem, getItems } = require('../controllers/itemsController');

const itemsRouter = Router();

itemsRouter.route('/')
  .get(requireAuth, getItems)
  .post(requireAuth, addItem);

module.exports = { itemsRouter };
