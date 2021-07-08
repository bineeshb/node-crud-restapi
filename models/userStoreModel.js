const { model, Schema } = require('mongoose');
const { transformGenerated } = require('../utils/schemaFunctions');
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

const UserStore = model('UserStore', userStoreSchema, 'userStores');

module.exports = UserStore;
