const { model, Schema } = require('mongoose');
const { transformGenerated } = require('../utils/schemaFunctions');

const itemSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Item name is required' ],
    unique: true
  }
});

const Item = model('Item', itemSchema);

module.exports = {
  itemSchema,
  Item
};
