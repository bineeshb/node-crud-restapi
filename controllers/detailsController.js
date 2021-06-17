const { Item, Details } = require('../models/detailsModel');
const { sendErrorResponse } = require('../utils/errorHandler');

const getDetails = async (req, res) => {
  try {
    const details = await Details.findOne({});
    const items = await Item.getItems();

    res.json({
      ...details.toJSON(),
      ...items
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const updateDetails = async (req, res) => {
  try {
    const { maxTotalItemsCount } = req.body;
    const details = await Details.findOne();

    const updatedDetails = await Details
      .findByIdAndUpdate(
        details._id,
        { maxTotalItemsCount },
        {
          new: true,
          runValidators: true
        }
      );
    let items = await Item.getItems();

    if (items.totalItemsCount > maxTotalItemsCount) {
      await Item.updateMany({}, { $set: { count: 0 } });
      items = await Item.getItems();
    }

    res.json({
      ...updatedDetails.toJSON(),
      ...items
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  getDetails,
  updateDetails
};
