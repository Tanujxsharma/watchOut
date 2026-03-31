const jwt = require('jsonwebtoken');
const createError = require('http-errors');

function authenticateGovernment(req, _res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return next(createError(401, 'Missing government token'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.governmentUser = payload;
    return next();
  } catch (error) {
    return next(createError(401, 'Government token invalid or expired'));
  }
}

module.exports = { authenticateGovernment };

