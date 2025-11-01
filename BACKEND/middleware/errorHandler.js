const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  const meta = {
    ip,
    route: req.originalUrl,
    method: req.method,
    body: req.body,
    message: err.message,
    stack: err.stack
  };
  logger.error('Unhandled error', meta);
  res.status(err.status || 500).json({ error: true, message: err.message || 'Internal Server Error' });
};
