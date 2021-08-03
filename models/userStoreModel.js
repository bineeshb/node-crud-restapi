const { model, Schema } = require('mongoose');
const { transformGenerated } = require('../utils/schemaFunctions');
const AppError = require('../utils/appError');
const { storeSchema } = require('./storeModel');

const userStoreSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [ storeSchema ]
},
{
  toObject: {
    transform: transformGenerated
  },
  toJSON: {
    transform: transformGenerated
  }
});
const getOtherItems = (items, excludeItemId) => items.filter(({ itemId }) => !itemId.equals(excludeItemId));

userStoreSchema.statics.checkAndGetStore = async function(userId) {
  const userStore = await this.findOne({ userId });

  if (userStore) {
    return userStore;
  }

  throw new AppError(`User doesn't have a store`, 400);
};

userStoreSchema.statics.updateItemQuantity = async function(storeId, itemId, quantity) {
  const userStore = await this.findById(storeId);
  const otherItems = getOtherItems(userStore.items, itemId);
  const items = quantity > 0
    ? [ ...otherItems, { itemId, quantity } ]
    : otherItems;
  const updatedDetails = {
    userId: userStore.userId,
    items
  };

  await this.findByIdAndUpdate(storeId, updatedDetails, {
    new: true,
    runValidators: true
  });
};

const UserStore = model('UserStore', userStoreSchema, 'userStores');

module.exports = UserStore;
