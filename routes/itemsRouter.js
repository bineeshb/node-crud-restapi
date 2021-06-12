const { Router } = require('express');
const ItemsModel = require('../models/itemsModel');
const { requireAuth } = require('../middlewares/authMiddleware');

const itemsRouter = Router();

itemsRouter.get('/', requireAuth, (req, res) => {
  ItemsModel.find()
    .then(result => res.json(result))
    .catch(error => console.error(error));
});

module.exports = { itemsRouter };
