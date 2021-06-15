const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Item name is required' ]
  },
  count: {
    type: Number,
    required: [ true, 'Item count is required' ],
    default: 0,
    min: [ 0, 'Item count must be greater than or equal to 0' ]
  }
});

const detailsSchema = new Schema({
  maxTotalItems: {
    type: Number,
    required: [ true, 'Maximum Total Items is required' ],
    min: [ 1, 'Maximum Total Items must be greater than or equal to 1' ]
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    }
  ]
});

const Item = model('Item', itemSchema);
const Details = model('Details', detailsSchema);

module.exports = {
  Item,
  Details
};
