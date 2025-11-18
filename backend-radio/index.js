// index.js
require('dotenv').config();

const connectDB = require('./config/db');
const buildApp = require('./app');

const PORT = process.env.PORT || 5000;

// Conexión a la base de datos y arranque del servidor
connectDB()
  .then(() => {
    const app = buildApp();
    app.listen(PORT, () => {
      console.log(`🚀 API lista en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a la DB:', err.message);
    process.exit(1);
  });
