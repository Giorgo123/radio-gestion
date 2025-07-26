import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AgencyForm = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API_URL}/agencies`, { name });
    setName('');
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Nueva agencia"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Agregar
      </button>
    </form>
  );
};

export default AgencyForm;
