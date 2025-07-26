const Transaction = require('../models/Transaction');
const Client      = require('../models/Client');

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
    const { client, type, amount } = req.body;
    const newTx = new Transaction({ client, type, amount });
    await newTx.save();

    const cli = await Client.findById(client);
    if (!cli) return res.status(404).json({ message: 'Cliente no encontrado' });

    cli.balance += (type === 'pago' ? -amount : amount);
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
    cli.balance += (tx.type === 'pago' ? tx.amount : -tx.amount);
    await cli.save();

    await tx.deleteOne();
    res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
