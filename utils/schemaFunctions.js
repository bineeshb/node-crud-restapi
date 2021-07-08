const removeId = function (doc, ret) {
  delete ret._id;
};

const transformGenerated = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

module.exports = {
  removeId,
  transformGenerated
};
