const createError = require('http-errors');
const { firebaseAuth, firestore } = require('../config/firebase');

async function authenticateUser(req, _res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      throw createError(401, 'Missing Authorization bearer token');
    }

    const decoded = await firebaseAuth.verifyIdToken(token, true);
    const snapshot = await firestore.collection('users').doc(decoded.uid).get();

    if (!snapshot.exists) {
      throw createError(404, 'User profile not found');
    }

    req.user = { uid: decoded.uid, ...snapshot.data() };
    next();
  } catch (error) {
    next(createError(error.status || 401, error.message || 'Invalid or expired token'));
  }
}

function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(createError(401, 'Auth guard misconfigured'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(createError(403, 'You are not allowed to access this resource'));
    }
    return next();
  };
}

function ensureCompanyApproved(req, _res, next) {
  if (req.user.role !== 'company') {
    return next(createError(403, 'Only companies can access this resource'));
  }
  if (['pending', 'rejected'].includes(req.user.status)) {
    return next(createError(403, 'Company profile not approved yet'));
  }
  return next();
}

module.exports = {
  authenticateUser,
  requireRole,
  ensureCompanyApproved
};

