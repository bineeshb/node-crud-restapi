const { model, Schema } = require('mongoose');
const AppError = require('../utils/appError');

const removeId = function (doc, ret) {
  delete ret._id;
};

const transformGenerated = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

const itemSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Item name is required' ],
    unique: true
  },
  count: {
    type: Number,
    required: [ true, 'Item count is required' ],
    default: 0,
    min: [ 0, 'Item count must be greater than or equal to 0' ]
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

const detailsSchema = new Schema({
  maxTotalItemsCount: {
    type: Number,
    required: [ true, 'Maximum Total Items count is required' ],
    min: [ 1, 'Maximum Total Items count must be greater than or equal to 1' ]
  }
},
{
  toObject: {
    transform: removeId
  },
  toJSON: {
    transform: removeId
  }
});

itemSchema.statics.getItems = async function() {
  const items = await this.find();

  return {
    noOfItems: items.length,
    totalItemsCount: items.reduce((total, { count }) => (total + count), 0),
    items
  };
};

itemSchema.pre('save', async function(next) {
  const { maxTotalItemsCount } = await Details.findOne();
  const { totalItemsCount } = await Item.getItems();

  if ((totalItemsCount + this.count) > maxTotalItemsCount) {
    throw new AppError(`Total Items count should not exceed Maximum Total Items count (${maxTotalItemsCount})`, 400);
  }

  next();
});

const Item = model('Item', itemSchema);
const Details = model('Details', detailsSchema);

module.exports = {
  Item,
  Details
};
