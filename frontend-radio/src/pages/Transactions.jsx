// src/pages/Transactions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import TransactionForm from "../components/TransactionForm";
import HistorialTransacciones from "../components/HistorialTransacciones";
import ReportesTransacciones from "../components/ReportesTransacciones";
import { Button } from "../components/ui/button";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState(false);

  const fetchData = async () => {
    try {
      const [txRes, clientsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/clients`),
      ]);
      setTransactions(txRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
<div className="p-6 bg-gray-50 min-h-screen">
  <h2 className="text-2xl font-bold mb-6 text-blue-600">Transacciones</h2>

  {/* Formulario siempre visible */}
  <TransactionForm onSuccess={fetchData} clients={clients} />

  {/* Secciones condicionales */}
  {mostrarHistorial && (
    <HistorialTransacciones
      transactions={transactions}
      clients={clients}
      fetchData={fetchData}
    />
  )}

  {mostrarReportes && (
    <ReportesTransacciones transactions={transactions} />
  )}

  {/* Botones SIEMPRE al final */}
  <div className="flex gap-4 mt-6">
    <Button onClick={() => setMostrarHistorial(!mostrarHistorial)}>
      {mostrarHistorial ? "Ocultar Historial" : "Ver Historial"}
    </Button>
    <Button onClick={() => setMostrarReportes(!mostrarReportes)}>
      {mostrarReportes ? "Ocultar Reportes" : "Ver Reportes"}
    </Button>
  </div>
</div>

  );
}
