const mongoose = require('mongoose');
const Client = require('../models/Client');
const Agency = require('../models/Agency');


// Obtener todos los clientes
const getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .sort({ name: 1 })
      .populate('agency', 'name');
    res.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// Crear un nuevo cliente
const createClient = async (req, res) => {
  try {
    const { name, agency, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre del cliente es obligatorio' });
    }

    let agencyId;
    if (agency) {
      if (!mongoose.Types.ObjectId.isValid(agency)) {
        return res.status(400).json({ message: 'ID de agencia inválido' });
      }
      const agencyExists = await Agency.findById(agency);
      if (!agencyExists) {
        return res.status(404).json({ message: 'La agencia indicada no existe' });
      }
      agencyId = agency;
    }

    const sanitizedEmail = typeof email === 'string' ? email.trim() : undefined;
    const sanitizedPhone = typeof phone === 'string' ? phone.trim() : undefined;

    const client = new Client({
      name: name.trim(),
      agency: agencyId,
      email: sanitizedEmail || undefined,
      phone: sanitizedPhone || undefined,
    });

    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
  try {
    const { name, agency, email, phone } = req.body;
    const setFields = {};
    const unsetFields = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio' });
      }
      setFields.name = name.trim();
    }

    if (agency !== undefined) {
      if (!agency) {
        unsetFields.agency = '';
      } else {
        if (!mongoose.Types.ObjectId.isValid(agency)) {
          return res.status(400).json({ message: 'ID de agencia inválido' });
        }
        const agencyExists = await Agency.findById(agency);
        if (!agencyExists) {
          return res.status(404).json({ message: 'La agencia indicada no existe' });
        }
        setFields.agency = agency;
      }
    }

    if (email !== undefined) {
      const sanitizedEmail = typeof email === 'string' ? email.trim() : '';
      if (sanitizedEmail) {
        setFields.email = sanitizedEmail;
      } else {
        unsetFields.email = '';
      }
    }

    if (phone !== undefined) {
      const sanitizedPhone = typeof phone === 'string' ? phone.trim() : '';
      if (sanitizedPhone) {
        setFields.phone = sanitizedPhone;
      } else {
        unsetFields.phone = '';
      }
    }

    const updateQuery = {};
    if (Object.keys(setFields).length > 0) {
      updateQuery.$set = setFields;
    }
    if (Object.keys(unsetFields).length > 0) {
      updateQuery.$unset = unsetFields;
    }

    if (Object.keys(updateQuery).length === 0) {
      return res.status(400).json({ message: 'No hay datos para actualizar' });
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

// Eliminar un cliente
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
