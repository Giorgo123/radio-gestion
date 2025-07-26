const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type:   { type: String, enum: ['pago', 'deuda'], required: true },
  amount: { type: Number, required: true },
  date:   { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
