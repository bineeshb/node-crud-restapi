const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const { detailsRouter } = require('./routes/detailsRouter');
const { userRouter } = require('./routes/userRouter');

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
  console.log(req);
  res.send('Hello !!!');
});

app.use(apiBaseURL, userRouter);
app.use(`${apiBaseURL}/details`, detailsRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
