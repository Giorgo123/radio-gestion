const express = require('express');
const router = express.Router();

const {
  getAgencies,
  createAgency,
  deleteAgency,
} = require('../controllers/agencyController');

router.get('/', getAgencies);
router.post('/', createAgency);
router.delete('/:id', deleteAgency);

module.exports = router;
