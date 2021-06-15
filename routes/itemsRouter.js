const { Router } = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { addItem, deleteItem, getItems, updateItem } = require('../controllers/itemsController');

const itemsRouter = Router();

itemsRouter.route('/')
  .get(requireAuth, getItems)
  .post(requireAuth, addItem);

itemsRouter.route('/:id')
  .put(requireAuth, updateItem)
  .delete(requireAuth, deleteItem);

module.exports = { itemsRouter };
