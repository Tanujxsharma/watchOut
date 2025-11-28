const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const createError = require('http-errors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const governmentRoutes = require('./routes/governmentRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(origin => origin.trim()).filter(Boolean);

app.use(cors({
  origin: function originValidator(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(createError(403, 'Origin not allowed by CORS'));
  },
  credentials: true
}));

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Too many attempts detected. Please try again in a few minutes.'
  }
});

app.use('/api/auth', authLimiter);

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

app.use(csrfProtection);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/csrf-token', (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/government', governmentRoutes);

app.use((_req, _res, next) => {
  next(createError(404, 'Route not found'));
});

app.use(errorHandler);

module.exports = app;

