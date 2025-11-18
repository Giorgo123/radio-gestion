const express = require('express');
const cors = require('cors');

const clientRoutes = require('./routes/clientRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const buildApp = () => {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get('/health', (_req, res) => res.status(200).send('ok'));
  app.get('/', (_req, res) => res.status(200).send('API Radio Gestión'));

  app.use('/api/clients', clientRoutes);
  app.use('/api/agencies', agencyRoutes);
  app.use('/api/transactions', transactionRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  });

  return app;
};

module.exports = buildApp;
