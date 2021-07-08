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

if (process.env.DB_URI) {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error(err));
} else {
  console.error('DB connection details not found');
}

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: `Check the available APIs in 'apis' property`,
    apis: [
      { path: `${apiBaseURL}/signup`, protocols: ['POST'] },
      { path: `${apiBaseURL}/login`, protocols: ['POST'] },
      { path: `${apiBaseURL}/logout`, protocols: ['GET'] },
      { path: `${apiBaseURL}/available-items`, protocols: ['GET', 'POST'] },
      { path: `${apiBaseURL}/available-items/:itemId`, protocols: ['PUT', 'DELETE'] },
      { path: `${apiBaseURL}/store-items`, protocols: ['GET', 'POST'] },
      { path: `${apiBaseURL}/store-items/:itemId`, protocols: ['PUT', 'DELETE'] }
    ]
  });
});

app.use(apiBaseURL, userRouter);
app.use(`${apiBaseURL}/available-items`, masterStoreRouter);
app.use(`${apiBaseURL}/store-items`, userStoreRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
