const { model, Schema } = require('mongoose');
const { transformGenerated } = require('../utils/schemaFunctions');

const storeSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: [ true, 'Item quantity is required' ],
    default: 0,
    min: [ 0, 'Item quantity must be greater than or equal to 0' ]
  }
},
{
  toObject: {
    transform: transformGenerated
  },
  toJSON: {
    transform: transformGenerated
  }
});

const MasterStore = model('MasterStore', storeSchema, 'masterStore');

module.exports = {
  storeSchema,
  MasterStore
};
