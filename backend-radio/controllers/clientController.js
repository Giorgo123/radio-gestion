const Transaction = require('../models/Transaction');
const Client      = require('../models/Client');
const Agency      = require('../models/Agency');


// Obtener todos los clientes
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('agency', 'name');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error });
  }
};

// Crear un nuevo cliente
const createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear cliente', error });
  }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar cliente' });
  }
};

// Eliminar un cliente
const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
