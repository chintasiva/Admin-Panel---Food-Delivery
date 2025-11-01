require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const dashboardRoute = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger); // logs every request (http, warn, error-level based on status)

app.use('/api/users', usersRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/dashboard', dashboardRoute);

app.get('/', (req, res) => res.send({ ok: true, msg: 'Food Delivery Admin API' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { })
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('DB connection error', { message: err.message, stack: err.stack });
    process.exit(1);
  });
