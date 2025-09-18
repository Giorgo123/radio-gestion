import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Home() {
  const [stats, setStats] = useState({
    clients: 0,
    agencies: 0,
    saldo: 0,
  });

  const fetchData = async () => {
    try {
      const [clientsRes, agenciesRes, txRes] = await Promise.all([
        axios.get(`${API_URL}/clients`),
        axios.get(`${API_URL}/agencies`),
        axios.get(`${API_URL}/transactions`),
      ]);

      // Calcular saldo acumulado
      let saldo = 0;
      txRes.data.forEach((tx) => {
        saldo += (tx.credit || 0) - (tx.debit || 0);
      });

      setStats({
        clients: clientsRes.data.length,
        agencies: agenciesRes.data.length,
        saldo,
      });
    } catch (err) {
      console.error("Error cargando datos del dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Clientes */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Clientes</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.clients}
          </p>
        </div>

        {/* Agencias */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Agencias</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.agencies}
          </p>
        </div>

        {/* Saldo total */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Saldo Total</h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              stats.saldo >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            ${stats.saldo.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </div>
  );
}
