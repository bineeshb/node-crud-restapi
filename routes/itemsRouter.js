const { Router } = require('express');
const ItemsModel = require('../models/itemsModel');

const itemsRouter = Router();

itemsRouter.get('/', (req, res) => {
  ItemsModel.find()
    .then(result => res.json(result))
    .catch(error => console.error(error));
});

module.exports = { itemsRouter };
