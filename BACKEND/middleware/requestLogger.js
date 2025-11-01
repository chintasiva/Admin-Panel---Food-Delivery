/*
  Request logger middleware.
  Logs at:
    - http/info for all successful responses (status < 400)
    - warn for 400-499
    - error for 500+
  Logged fields: ip, timestamp, email_id (if provided in body or headers), method, route, status, body
*/
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  // capture body now (if large bodies in prod consider limiting)
  const body = req.body;
  const email = req.body?.email || req.headers['x-user-email'] || null;

  // hook into finish to get status
  res.on('finish', () => {
    const duration = Date.now() - start;
    const meta = {
      ip,
      email_id: email,
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      body
    };
    if (res.statusCode >= 500) {
      logger.error('HTTP %s %s %s', req.method, req.originalUrl, JSON.stringify(meta), { meta });
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP %s %s %s', req.method, req.originalUrl, JSON.stringify(meta), { meta });
    } else {
      logger.info('HTTP %s %s %s', req.method, req.originalUrl, JSON.stringify(meta), { meta });
    }
  });
  next();
};
