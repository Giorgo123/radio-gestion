const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Usa db.js, no dblarga.js
require("dotenv").config();

// Rutas
const clientRoutes = require("./routes/clientRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.use("/api/clients", clientRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/transactions", transactionRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
