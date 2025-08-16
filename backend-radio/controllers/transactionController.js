const Transaction = require('../models/Transaction');
const Client = require('../models/Client');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find().populate('client', 'name');
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const cli = await Client.findById(client);
    if (!cli) return res.status(404).json({ message: 'Cliente no encontrado' });

    const lastTx = await Transaction.findOne({ client }).sort({ date: -1 });
    const prevBalance = lastTx ? lastTx.balance : 0;

    let debit = 0;
    let credit = 0;

    if (type === 'deuda') debit = amount;
    else if (type === 'pago') credit = amount;
    else return res.status(400).json({ message: 'Tipo de transacción inválido' });

    const newBalance = prevBalance + debit - credit;

    const newTx = new Transaction({
      client,
      type,
      date: date || new Date(),
      dueDate,
      orderNumber,
      receiptOrInvoice,
      promoter,
      debit,
      credit,
      balance: newBalance,
    });

    await newTx.save();

    cli.balance = newBalance;
    await cli.save();

    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' });

    const cli = await Client.findById(tx.client);
    if (!cli) return res.status(404).json({ message: 'Cliente no encontrado' });

    // Invertimos la operación para corregir el balance
    cli.balance = tx.type === 'pago'
      ? cli.balance + tx.credit
      : cli.balance - tx.debit;

    await cli.save();
    await tx.deleteOne();

    res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
