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
      const msg = !err.response
        ? "No se pudo conectar con el backend. Verificá que esté corriendo y la variable REACT_APP_API_URL."
        : err.response?.data?.message || "No se pudieron cargar las transacciones";
      try { const { toast } = await import("react-toastify"); toast.error(msg); } catch {}
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Transacciones</h2>

      <TransactionForm onSuccess={fetchData} clients={clients} />

      {mostrarHistorial && (
        <div className="bg-white text-gray-800 shadow rounded p-4 mt-6">
          <HistorialTransacciones
            transactions={transactions}
            clients={clients}
            fetchData={fetchData}
          />
        </div>
      )}

      {mostrarReportes && (
        <div className="bg-white text-gray-800 shadow rounded p-4 mt-6">
          <ReportesTransacciones transactions={transactions} />
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button
          variant="default"
          onClick={() => setMostrarHistorial(!mostrarHistorial)}
        >
          {mostrarHistorial ? "Ocultar Historial" : "Ver Historial"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setMostrarReportes(!mostrarReportes)}
        >
          {mostrarReportes ? "Ocultar Reportes" : "Ver Reportes"}
        </Button>
      </div>
    </div>
  );
}
