// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction
} = require('../controllers/transactionController');



router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);



module.exports = router;
