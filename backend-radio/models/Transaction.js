const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['pago', 'deuda'], required: true },
  date: { type: String, required: true },    // guardamos YYYY-MM-DD
  dueDate: { type: String },                  // opcional                           // Vencimiento
  orderNumber: { type: String },                         // Orden interna
  receiptOrInvoice: { type: String },                    // Nº de recibo o factura
  promoter: { type: String },                            // Promotor (persona o user)
  debit: { type: Number, default: 0 },                   // Debe
  credit: { type: Number, default: 0 },                  // Haber
  balance: { type: Number, default: 0 },                 // Saldo después de esta operación
  vendorCommission: { type: Number, default: 0 },
  radioRevenue: { type: Number, default: 0 },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
