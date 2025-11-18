const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Client = require('../models/Client');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .populate('client', 'name balance');
    res.json(transactions);
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
      type, // 'deuda' o 'pago'
      amount,
      date,
      dueDate,
      orderNumber,
      receiptOrInvoice,
      promoter
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(client)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const clientRecord = await Client.findById(client);
    if (!clientRecord) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (!['deuda', 'pago'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de transacción inválido' });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'El monto debe ser un número positivo' });
    }

    const transactionDate = date ? new Date(date) : new Date();
    if (Number.isNaN(transactionDate.getTime())) {
      return res.status(400).json({ message: 'Fecha de transacción inválida' });
    }

    let dueDateValue;
    if (dueDate) {
      dueDateValue = new Date(dueDate);
      if (Number.isNaN(dueDateValue.getTime())) {
        return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
      }
    }

    const latestTransaction = await Transaction.findOne({ client }).sort({ createdAt: -1 });
    const previousBalance = latestTransaction ? latestTransaction.balance : clientRecord.balance || 0;

    let debit = 0;
    let credit = 0;

    if (type === 'deuda') debit = numericAmount;
    else credit = numericAmount;

    const updatedBalance = previousBalance + debit - credit;

    const sanitizedOrderNumber = typeof orderNumber === 'string' ? orderNumber.trim() : '';
    const sanitizedReceipt = typeof receiptOrInvoice === 'string' ? receiptOrInvoice.trim() : '';
    const sanitizedPromoter = typeof promoter === 'string' ? promoter.trim() : '';

    const newTx = new Transaction({
      client,
      type,
      date: transactionDate,
      dueDate: dueDateValue,
      orderNumber: sanitizedOrderNumber || undefined,
      receiptOrInvoice: sanitizedReceipt || undefined,
      promoter: sanitizedPromoter || undefined,
      debit,
      credit,
      balance: updatedBalance,
    });

    await newTx.save();

    clientRecord.balance = updatedBalance;
    await clientRecord.save();

    res.status(201).json(newTx);
  } catch (err) {
    console.error('Error al crear transacción:', err);
    res.status(500).json({ message: 'Error al crear transacción' });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' });

    const clientRecord = await Client.findById(tx.client);
    if (!clientRecord) return res.status(404).json({ message: 'Cliente no encontrado' });

    // Invertimos la operación para corregir el balance
    clientRecord.balance = tx.type === 'pago'
      ? clientRecord.balance + tx.credit
      : clientRecord.balance - tx.debit;

    await clientRecord.save();
    await tx.deleteOne();

    res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    console.error('Error al eliminar transacción:', err);
    res.status(500).json({ message: 'Error al eliminar transacción' });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
