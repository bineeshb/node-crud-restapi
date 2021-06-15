const { Details } = require('../models/detailsModel');
const errorHandler = require('../utils/errorHandler');

const getDetails = async (req, res) => {
  try {
    const details = await Details.findOne({}, '-_id').populate('items');
    res.status(200).json(details);
  } catch(error) {
    const { statusCode, errors } = errorHandler(error);
    res.status(statusCode).json(errors);
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

    res.status(200).json(updatedDetails);
  } catch(error) {
    const { statusCode, errors } = errorHandler(error);
    res.status(statusCode).json(errors);
  }
};

module.exports = {
  getDetails,
  updateDetails
};
