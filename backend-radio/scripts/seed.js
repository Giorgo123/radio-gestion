/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Agency = require('../models/Agency');
const Client = require('../models/Client');
const Transaction = require('../models/Transaction');
const Contract = require('../models/Contract');

async function seed() {
  try {
    await connectDB();

    const [agencyCount, clientCount, txCount, contractCount] = await Promise.all([
      Agency.countDocuments(),
      Client.countDocuments(),
      Transaction.countDocuments(),
      Contract.countDocuments(),
    ]);

    if (agencyCount === 0) {
      console.log('➕ Insertando agencias demo...');
      await Agency.insertMany([
        { name: 'Agencia Central', email: 'contacto@central.com', phone: '011-1234-5678' },
        { name: 'Agencia Norte', email: 'info@norte.com', phone: '011-2222-3333' },
      ]);
    }

    const agencies = await Agency.find().sort({ name: 1 });
    const agencyCentral = agencies[0]?._id;

    if (clientCount === 0) {
      console.log('➕ Insertando clientes demo...');
      await Client.insertMany([
        { name: 'Cliente Demo', agency: agencyCentral, email: 'cliente@demo.com', phone: '123456', balance: 0 },
        { name: 'Cliente Sin Agencia', email: 'sin@agencia.com', phone: '987654', balance: 0 },
      ]);
    }

    const demoClient = await Client.findOne({ name: 'Cliente Demo' });

    if (contractCount === 0) {
      console.log('➕ Insertando contratos demo...');
      const today = new Date();
      await Contract.create({
        advertiser: 'Acme Corp',
        program: 'Mañanas en Vivo',
        schedule: 'Lun a Vie 10:00 - 12:00',
        pricePerSlot: 5000,
        passesCount: 20,
        startDate: today,
        endDate: null,
      });
    }

    if (txCount === 0 && demoClient) {
      console.log('➕ Insertando transacciones demo...');
      let balance = 0;
      const deuda = await Transaction.create({
        client: demoClient._id,
        type: 'deuda',
        date: new Date(),
        debit: 15000,
        credit: 0,
        balance: (balance += 15000),
        orderNumber: 'ORD-001',
        promoter: 'Admin',
      });

      const pago = await Transaction.create({
        client: demoClient._id,
        type: 'pago',
        date: new Date(),
        debit: 0,
        credit: 5000,
        balance: (balance -= 5000),
        receiptOrInvoice: 'REC-1001',
        promoter: 'Admin',
      });

      demoClient.balance = balance;
      await demoClient.save();
      console.log('Transacciones creadas:', deuda._id.toString(), pago._id.toString());
    }

    console.log('✅ Seed finalizado');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

seed();

