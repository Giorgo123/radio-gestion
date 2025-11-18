const Agency = require('../models/Agency');

// Obtener todas las agencias
const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().sort({ name: 1 });
    res.json(agencies);
  } catch (error) {
    console.error('Error al obtener agencias:', error);
    res.status(500).json({ message: 'Error al obtener agencias' });
  }
};

// Crear nueva agencia
const createAgency = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre de la agencia es obligatorio' });
    }

    const normalizedName = name.trim();
    const existingAgency = await Agency.findOne({ name: normalizedName });
    if (existingAgency) {
      return res.status(409).json({ message: 'Ya existe una agencia con ese nombre' });
    }

    const sanitizedEmail = typeof email === 'string' ? email.trim() : undefined;
    const sanitizedPhone = typeof phone === 'string' ? phone.trim() : undefined;

    const agency = new Agency({
      name: normalizedName,
      email: sanitizedEmail || undefined,
      phone: sanitizedPhone || undefined,
    });

    const savedAgency = await agency.save();
    res.status(201).json(savedAgency);
  } catch (error) {
    console.error('Error al crear agencia:', error);
    res.status(500).json({ message: 'Error al crear agencia' });
  }
};

// Eliminar agencia por ID
const deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) {
      return res.status(404).json({ message: 'Agencia no encontrada' });
    }

    res.json({ message: 'Agencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar agencia:', error);
    res.status(500).json({ message: 'Error al eliminar agencia' });
  }
};

module.exports = {
  getAgencies,
  createAgency,
  deleteAgency,
};
