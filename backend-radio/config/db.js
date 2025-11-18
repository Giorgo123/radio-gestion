const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/radio-gestion-dev';
let memoryServer = null;

const connectDB = async (mongoUri) => {
  let resolvedUri = mongoUri || process.env.MONGO_URI || null;

  if (!resolvedUri && process.env.USE_IN_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    resolvedUri = memoryServer.getUri();
    console.warn('⚠️  Usando MongoDB en memoria para desarrollo/tests');
  }

  if (!resolvedUri && process.env.NODE_ENV !== 'production') {
    resolvedUri = DEFAULT_LOCAL_URI;
    console.warn(
      `⚠️  MONGO_URI no provista. Usando local por defecto: ${DEFAULT_LOCAL_URI}`
    );
  }

  if (!resolvedUri) {
    throw new Error('MONGO_URI no está configurada');
  }

  try {
    await mongoose.connect(resolvedUri);
    console.log('🟢 Conectado a MongoDB');
  } catch (error) {
    console.error('🔴 Error conectando a MongoDB', error);
    throw error;
  }
};

module.exports = connectDB;
