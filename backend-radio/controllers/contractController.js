const Contract = require('../models/Contract');

const parseDate = (value, fallback) => {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

const getContracts = async (_req, res) => {
  try {
    const contracts = await Contract.find().sort({ startDate: -1, createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener contratos', error });
  }
};

const createContract = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear contrato', error });
  }
};

const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    contract.set(req.body);
    contract.recalculateTotal();
    await contract.save();

    res.json(contract);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar contrato', error });
  }
};

const deleteContract = async (req, res) => {
  try {
    const deleted = await Contract.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }
    res.json({ message: 'Contrato eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar contrato', error });
  }
};

const getContractsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const rangeStart = parseDate(startDate, new Date('1970-01-01'));
    const rangeEnd = parseDate(endDate, new Date('2999-12-31'));

    const contracts = await Contract.find();

    const totalInRange = contracts
      .filter((contract) => {
        const start = contract.startDate;
        const end = contract.endDate || contract.startDate;
        if (!start) return false;
        return start <= rangeEnd && end >= rangeStart;
      })
      .reduce((sum, contract) => sum + (contract.total || 0), 0);

    const today = new Date();
    const activeAdvertisers = [
      ...new Set(
        contracts
          .filter((contract) => {
            if (!contract.startDate) return false;
            if (contract.endDate) {
              return contract.endDate >= today;
            }
            return contract.startDate <= today;
          })
          .map((contract) => contract.advertiser)
          .filter(Boolean)
      ),
    ];

    res.json({ totalInRange, activeAdvertisers });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen', error });
  }
};

module.exports = {
  getContracts,
  createContract,
  updateContract,
  deleteContract,
  getContractsSummary,
};
