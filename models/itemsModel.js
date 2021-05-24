const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Item name is required' ],
    enum: {
      values: [
        'Orange',
        'Banana',
        'Grape'
      ],
      message: '{VALUE} is not a valid item'
    }
  },
  count: {
    type: Number,
    required: [ true, 'Item count is required' ],
    default: 0,
    min: [ 0, 'Item count must be greater than or equal to 0' ]
  }
});

const itemsSchema = new Schema({
  totalItems: {
    type: Number,
    required: [ true, 'Total Items is required' ],
    min: [ 1, 'Total Items must be greater than or equal to 1' ]
  },
  items: [ itemSchema ]
});

const Items = model('Items', itemsSchema);
module.exports = Items;
