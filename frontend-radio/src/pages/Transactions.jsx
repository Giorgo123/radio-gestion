import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
// import TransactionList from '../components/TransactionList';
import { API_URL } from '../config';

const Transactions = () => {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/transactions`);
        setTxs(res.data);
      } catch (err) {
        console.error("Error al obtener transacciones:", err);
      }
    };
    fetch();
  }, []);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Transacciones</h2>
      <TransactionForm onAdd={fetch} />

      <div className="overflow-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-100">
              {['Cliente','Tipo','Monto','Fecha','Acciones'].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txs.map(tx => (
              <tr key={tx._id} className="border-t">
                <td className="px-4 py-2">{tx.client?.name}</td>
                <td className="px-4 py-2 capitalize">{tx.type}</td>
                <td className={`px-4 py-2 ${tx.type==='pago' ? 'text-green-600' : 'text-red-600'}`}>
                  ${tx.amount}
                </td>
                <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => window.confirm('Eliminar?') && axios.delete(`${API_URL}/transactions/${tx._id}`).then(fetch)}
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

export default Transactions;
