const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Client = require('../models/Client');

/**
 * Normaliza cualquier string o Date a YYYY-MM-DD
 */
const normalizeDateToString = (dateInput) => {
  if (!dateInput) return null;

  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return dateInput.toISOString().slice(0, 10);
  }

  return null;
};

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .populate('client', 'name balance');

    const normalized = transactions.map(tx => {
      const txObj = tx.toObject();
      txObj.date = normalizeDateToString(txObj.date);
      txObj.dueDate = normalizeDateToString(txObj.dueDate);
      return txObj;
    });

    res.json(normalized);
  } catch (err) {
    console.error('Error al obtener transacciones:', err);
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const {
      client,
      type,
      amount,
      date, // YYYY-MM-DD string
      dueDate,
      orderNumber,
      receiptOrInvoice,
      promoter,
      vendorCommission = 0,
      radioRevenue = 0,
      description = ""
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(client))
      return res.status(400).json({ message: 'ID de cliente inválido' });

    const clientRecord = await Client.findById(client);
    if (!clientRecord) return res.status(404).json({ message: 'Cliente no encontrado' });

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0)
      return res.status(400).json({ message: 'Monto inválido' });

    const txDate = normalizeDateToString(date);
    if (!txDate) return res.status(400).json({ message: 'Fecha de transacción inválida' });

    const dueDateNormalized = dueDate ? normalizeDateToString(dueDate) : null;

    const debit = type === 'deuda' ? numericAmount : 0;
    const credit = type === 'pago' ? numericAmount : 0;

    const latestTransaction = await Transaction.findOne({ client }).sort({ createdAt: -1 });
    const previousBalance = latestTransaction ? latestTransaction.balance : clientRecord.balance || 0;

    const newTx = new Transaction({
      client,
      type,
      date: txDate,
      dueDate: dueDateNormalized,
      orderNumber: orderNumber?.trim() || undefined,
      receiptOrInvoice: receiptOrInvoice?.trim() || undefined,
      promoter: promoter?.trim() || undefined,
      debit,
      credit,
      balance: previousBalance + credit - debit,
      vendorCommission: Number(vendorCommission),
      radioRevenue: Number(radioRevenue),
      description: description.trim()
    });

    await newTx.save();

    clientRecord.balance = previousBalance + credit - debit;
    await clientRecord.save();

    res.status(201).json(newTx.toObject());
  } catch (err) {
    console.error('Error crear transacción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' });

    if (updateData.date) tx.date = normalizeDateToString(updateData.date);
    if (updateData.dueDate !== undefined) tx.dueDate = updateData.dueDate ? normalizeDateToString(updateData.dueDate) : null;

    if (updateData.client) tx.client = updateData.client;
    if (updateData.type) {
      const amount = Number(updateData.amount || 0);
      tx.debit = updateData.type === 'deuda' ? amount : 0;
      tx.credit = updateData.type === 'pago' ? amount : 0;
    }
    tx.orderNumber = updateData.orderNumber?.trim();
    tx.receiptOrInvoice = updateData.receiptOrInvoice?.trim();
    tx.promoter = updateData.promoter?.trim();
    tx.vendorCommission = Number(updateData.vendorCommission || 0);
    tx.radioRevenue = Number(updateData.radioRevenue || 0);
    tx.description = updateData.description?.trim();

    await tx.save();

    // Recalcular balances secuencial
    const clientTxs = await Transaction.find({ client: tx.client }).sort({ date: 1, createdAt: 1 });
    let balance = 0;
    for (const t of clientTxs) {
      balance += (t.credit || 0) - (t.debit || 0);
      t.balance = balance;
      await t.save();
    }

    res.json(tx.toObject());
  } catch (err) {
    console.error('Error actualizar transacción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE
const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' });

    const clientRecord = await Client.findById(tx.client);
    if (!clientRecord) return res.status(404).json({ message: 'Cliente no encontrado' });

    const adjustment = (tx.credit || 0) - (tx.debit || 0);
    clientRecord.balance -= adjustment;
    await clientRecord.save();

    await tx.deleteOne();

    const clientTxs = await Transaction.find({ client: tx.client }).sort({ date: 1, createdAt: 1 });
    let balance = clientRecord.balance;
    for (const t of clientTxs) {
      balance += (t.credit || 0) - (t.debit || 0);
      t.balance = balance;
      await t.save();
    }

    res.json({ message: 'Transacción eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminar transacción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};