const { Details } = require('../models/detailsModel');
const { sendErrorResponse } = require('../utils/errorHandler');

const getDetails = async (req, res) => {
  try {
    const details = await Details.findOne({}, '-_id').populate('items');
    res.json(details);
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

const updateDetails = async (req, res) => {
  try {
    const { maxTotalItems } = req.body;
    const details = await Details.findOne();

    const updatedDetails = await Details
      .findByIdAndUpdate(
        details._id,
        { maxTotalItems },
        {
          new: true,
          runValidators: true,
          projection: {
            _id: 0
          }
        }
      )
      .populate('items');

    res.json(updatedDetails);
  } catch(error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  getDetails,
  updateDetails
};
