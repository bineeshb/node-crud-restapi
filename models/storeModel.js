const { model, Schema } = require('mongoose');
const { transformGenerated } = require('../utils/schemaFunctions');
const AppError = require('../utils/appError');

const storeSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: [ true, 'Item quantity is required' ],
    default: 1,
    min: [ 1, 'Item quantity must be greater than or equal to 1' ]
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

storeSchema.statics.getItem = async function (itemId) {
  const storeItem = await this.findOne({ itemId });

  if (storeItem) {
    return storeItem;
  }

  throw new AppError('Item not found in store', 400);
};

storeSchema.statics.updateItemQuantity = async function (storeItemId, quantity) {
  if (quantity > 0) {
    await this.findByIdAndUpdate(storeItemId, { quantity }, {
      new: true,
      runValidators: true
    });
  } else {
    await this.findByIdAndDelete(storeItemId);
  }
};

const MasterStore = model('MasterStore', storeSchema, 'masterStore');

module.exports = {
  storeSchema,
  MasterStore
};
