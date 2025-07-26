const Transaction = require('../models/Transaction');
const Client      = require('../models/Client');
const Agency      = require('../models/Agency');

// Obtener todas las agencias
const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener agencias', error });
  }
};

// Crear nueva agencia
const createAgency = async (req, res) => {
  try {
    const newAgency = new Agency({ name: req.body.name });
    const savedAgency = await newAgency.save();
    res.status(201).json(savedAgency);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear agencia', error });
  }
};

// Eliminar agencia por ID
const deleteAgency = async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar agencia', error });
  }
};

module.exports = {
  getAgencies,
  createAgency,
  deleteAgency,
};
