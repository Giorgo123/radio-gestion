// components/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const TransactionForm = ({ onAdd }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('deuda');
  const [amount, setAmount] = useState('');
  

  useEffect(() => {
    axios.get(`${API_URL}/clients`)
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId || !amount) {
      alert('Completa todos los campos');
      return;
    }

    try {
      await axios.post(`${API_URL}/transactions`, {
        client: clientId,
        type,
        amount: Number(amount)
      });

      alert('Transacción creada');
      setClientId('');
      setType('deuda');
      setAmount('');

      if (onAdd) onAdd(); // <== Avisamos que se agregó para refrescar lista
    } catch (error) {
      console.error(error);
      alert('Error al crear transacción');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Nueva Transacción</h3>

      <label>
        Cliente:
        <select value={clientId} onChange={e => setClientId(e.target.value)} required>
          <option value="">--Seleccionar--</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 15 }}>
        Tipo:
        <select value={type} onChange={e => setType(e.target.value)} required>
          <option value="deuda">Deuda</option>
          <option value="pago">Pago</option>
        </select>
      </label>

      <label style={{ marginLeft: 15 }}>
        Monto:
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="0.01"
          required
        />
      </label>

      <button type="submit" style={{ marginLeft: 15 }}>Agregar</button>
    </form>
  );
};

export default TransactionForm;
