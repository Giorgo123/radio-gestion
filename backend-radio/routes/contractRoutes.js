const express = require('express');
const router = express.Router();
const {
  getContracts,
  createContract,
  updateContract,
  deleteContract,
  getContractsSummary,
} = require('../controllers/contractController');

router.get('/', getContracts);
router.get('/summary', getContractsSummary);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

module.exports = router;
