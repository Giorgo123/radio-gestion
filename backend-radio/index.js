// index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const clientRoutes = require("./routes/clientRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * CORS seguro para producción
 * - Permití tu Netlify y tu dominio (si lo tenés)
 * - Podés setear múltiples orígenes via env, separados por coma
 *   CORS_ORIGINS=https://tu-sitio.netlify.app,https://www.tudominio.com
 */
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir Postman/SSR/sin origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// Healthcheck para Render
app.get("/health", (_req, res) => res.status(200).send("ok"));

// (Opcional) raíz
app.get("/", (_req, res) => res.status(200).send("API Radio Gestión"));

// Rutas API
app.use("/api/clients", clientRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/transactions", transactionRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Conexión a la base de datos y arranque
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API lista en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ No se pudo conectar a la DB:", err.message);
    process.exit(1);
  });
