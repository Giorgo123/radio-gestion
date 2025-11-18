const { createClient } = require('../controllers/clientController');
const { createTransaction } = require('../controllers/transactionController');
const Agency = require('../models/Agency');
const Client = require('../models/Client');
const Transaction = require('../models/Transaction');

jest.mock('../models/Agency');
jest.mock('../models/Client');
jest.mock('../models/Transaction');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createClient controller', () => {
  test('returns 400 when name is missing', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await createClient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'El nombre del cliente es obligatorio',
    });
  });

  test('persists a client with trimmed fields', async () => {
    const agencyId = '60ddc9732f8fb814c8d6e5a0';
    Agency.findById = jest.fn().mockResolvedValue({ _id: agencyId });

    const savedClient = {
      _id: 'client-id',
      name: 'Cliente Demo',
      agency: 'agency-id',
      email: 'demo@example.com',
      phone: '123456',
    };

    Client.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedClient),
    }));

    const req = {
      body: {
        name: '  Cliente Demo  ',
        email: ' demo@example.com ',
        phone: '123456 ',
        agency: agencyId,
      },
    };
    const res = mockResponse();

    await createClient(req, res);

    expect(Agency.findById).toHaveBeenCalledWith(agencyId);
    expect(Client).toHaveBeenCalledWith({
      name: 'Cliente Demo',
      agency: agencyId,
      email: 'demo@example.com',
      phone: '123456',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedClient);
  });
});

describe('createTransaction controller', () => {
  const baseRequest = {
    body: {
      client: '60ddc9732f8fb814c8d6e5a1',
      type: 'deuda',
      amount: 150,
      date: new Date('2024-01-01').toISOString(),
    },
  };

  test('rejects invalid client id format', async () => {
    const res = mockResponse();
    await createTransaction({ body: { ...baseRequest.body, client: 'invalid' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ID de cliente inválido',
    });
  });

  test('rejects invalid transaction type', async () => {
    Client.findById = jest.fn().mockResolvedValue({ _id: 'id', balance: 0, save: jest.fn() });

    const res = mockResponse();
    await createTransaction({ body: { ...baseRequest.body, type: 'otro' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tipo de transacción inválido',
    });
  });

  test('saves transaction and updates client balance', async () => {
    const clientDoc = { _id: '60ddc9732f8fb814c8d6e5a1', balance: 25, save: jest.fn().mockResolvedValue() };
    Client.findById = jest.fn().mockResolvedValue(clientDoc);
    Transaction.findOne = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    const savedTx = {
      client: baseRequest.body.client,
      type: 'deuda',
      debit: 150,
      credit: 0,
      balance: 175,
      save: jest.fn().mockResolvedValue(),
    };

    Transaction.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedTx),
    }));

    const res = mockResponse();
    await createTransaction(baseRequest, res);

    expect(Transaction).toHaveBeenCalledWith(
      expect.objectContaining({
        client: baseRequest.body.client,
        type: 'deuda',
        debit: 150,
        credit: 0,
        balance: 175,
      })
    );
    expect(clientDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      balance: 175,
      debit: 150,
      credit: 0,
    }));
  });
});
