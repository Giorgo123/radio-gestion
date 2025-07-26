import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClientForm from '../components/ClientForm';
import { API_URL } from '../config';

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      }
    };
    fetch();
  }, []);


  const handleDelete = async id => {
    if (!window.confirm('Eliminar cliente?')) return;
    await axios.delete(`${API_URL}/clients/${id}`);
    fetch();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Clientes</h2>
      <ClientForm onAdd={fetch} />

      <div className="overflow-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-left">
              {['Nombre','Agencia','Email','Teléfono','Acciones'].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.agency?.name || '-'}</td>
                <td className="px-4 py-2">{c.email || '-'}</td>
                <td className="px-4 py-2">{c.phone || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
