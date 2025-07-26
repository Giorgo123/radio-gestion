// components/TransactionList.jsx
import React from 'react';

const TransactionList = ({ transactions, onDelete }) => {
  if (!transactions.length) return <p>No hay transacciones para mostrar.</p>;

  return (
    <ul>
      {transactions.map(tx => (
        <li key={tx._id}>
          Cliente: {tx.client?.name || 'Sin nombre'} — ${tx.amount} ({tx.type})
          <button 
            onClick={() => onDelete(tx._id)} 
            style={{ marginLeft: 10, color: 'red' }}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
