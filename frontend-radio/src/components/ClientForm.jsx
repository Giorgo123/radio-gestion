import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';


const ClientForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/agencies`)
      .then(res => setAgencies(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Completá el nombre');
      return;
    }

    try {
      await axios.post(`${API_URL}/clients`, {
        name,
        agency: agencyId || null, // Si no hay agencia, se envía null
        email,
        phone,
      });
      alert('Cliente creado');
      setName('');
      setAgencyId('');
      setEmail('');
      setPhone('');
      if (onAdd) onAdd();
    } catch (error) {
      console.error(error);
      alert('Error al crear cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Nuevo Cliente</h3>
      <label>
        Nombre:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>
      <label style={{ marginLeft: 15 }}>
        Agencia (opcional):
        <select
          value={agencyId}
          onChange={e => setAgencyId(e.target.value)}
        >
          <option value="">--Sin agencia--</option>
          {agencies.map(a => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
      </label>
      <label style={{ marginLeft: 15 }}>
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label style={{ marginLeft: 15 }}>
        Teléfono:
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </label>
      <button type="submit" style={{ marginLeft: 15 }}>Agregar</button>
    </form>
  );
};

export default ClientForm;
