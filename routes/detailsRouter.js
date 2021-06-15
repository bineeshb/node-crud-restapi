const { Router } = require('express');
const { getDetails, updateDetails } = require('../controllers/detailsController');
const { requireAuth } = require('../middlewares/authMiddleware');

const detailsRouter = Router();

detailsRouter.route('/')
  .get(requireAuth, getDetails)
  .put(requireAuth, updateDetails);

module.exports = { detailsRouter };
