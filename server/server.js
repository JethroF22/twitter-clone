const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  require('dotenv').config();
} else {
  require('dotenv').config({ path: './.env.test' });
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const mongoose = require('./db/mongoose');
const authRoutes = require('./routes/auth');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
