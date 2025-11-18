const mongoose = require('mongoose');

const connectDB = async (mongoUri = process.env.MONGO_URI) => {
  if (!mongoUri) {
    throw new Error('MONGO_URI no está configurada');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('🟢 Conectado a MongoDB');
  } catch (error) {
    console.error('🔴 Error conectando a MongoDB', error);
    throw error;
  }
};

module.exports = connectDB;
