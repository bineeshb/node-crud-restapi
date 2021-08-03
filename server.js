const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const { userRouter } = require('./routes/userRouter');
const { masterStoreRouter } = require('./routes/masterStoreRouter');
const { userStoreRouter } = require('./routes/userStoreRouter');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const apiBaseURL = '/api/v1';
const apiAvailableItems = `${apiBaseURL}/available-items`;
const apiStoreItems = `${apiBaseURL}/store-items`;

if (process.env.DB_URI) {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error(err));
} else {
  console.error('DB connection details not found');
}

app.use(cookieParser());
app.use(express.json());

app.get(apiBaseURL, (req, res) => {
  res.json({
    message: `Check the available APIs in 'apis' property`,
    apis: [
      { path: `${apiBaseURL}/signup`, protocols: ['POST'] },
      { path: `${apiBaseURL}/login`, protocols: ['POST'] },
      { path: `${apiBaseURL}/logout`, protocols: ['GET'] },
      { path: apiAvailableItems, protocols: ['GET', 'POST'] },
      { path: `${apiAvailableItems}/<ITEM_ID>`, protocols: ['PUT', 'DELETE'] },
      { path: `${apiAvailableItems}/<ITEM_ID>/buy`, protocols: ['POST'] },
      { path: apiStoreItems, protocols: ['GET'] },
      { path: `${apiStoreItems}/<ITEM_ID>/sell`, protocols: ['PUT'] },
      { path: `${apiStoreItems}/<ITEM_ID>`, protocols: ['DELETE'] }
    ]
  });
});

app.use(apiBaseURL, userRouter);
app.use(apiAvailableItems, masterStoreRouter);
app.use(apiStoreItems, userStoreRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
