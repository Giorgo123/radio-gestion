import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AgencyForm from '../components/AgencyForm';
import { API_URL } from '../config';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);

  const fetchAgencies = () => {
    axios.get(`${API_URL}/agencies`).then(r=>setAgencies(r.data));
  };
  useEffect(fetchAgencies, []);

  const handleDelete = async id => {
    if (!window.confirm('Eliminar agencia?')) return;
    await axios.delete(`${API_URL}/agencies/${id}`);
    fetchAgencies();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Agencias</h2>
      <div className="mb-6">
        <AgencyForm onAdd={fetchAgencies} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agencies.map(a => (
          <div key={a._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
            <span className="font-medium text-gray-800">{a.name}</span>
            <button
              onClick={() => handleDelete(a._id)}
              className="text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agencies;
