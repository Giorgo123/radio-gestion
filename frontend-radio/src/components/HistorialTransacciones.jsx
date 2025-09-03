import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function HistorialTransacciones({ transactions, clients, fetchData }) {
  const [clientFilter, setClientFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filtrar
  const filteredTxs = transactions.filter((tx) => {
    if (clientFilter && tx.client?._id !== clientFilter) return false;

    const txDate = new Date(tx.date);
    if (fromDate && txDate < new Date(fromDate)) return false;
    if (toDate && txDate > new Date(toDate)) return false;

    return true;
  });

  // Calcular totales
  let runningBalance = 0;
  let totalDebe = 0;
  let totalHaber = 0;

  const txsWithBalance = filteredTxs
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((tx) => {
      totalDebe += tx.debit || 0;
      totalHaber += tx.credit || 0;
      runningBalance += (tx.credit || 0) - (tx.debit || 0);
      return { ...tx, runningBalance };
    });

  return (
    <div className="mt-8">
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div style={{ minWidth: 250 }}>
          <label className="block mb-1 font-semibold">Cliente</label>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border rounded p-1 w-full"
          >
            <option value="">Todos</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Desde</label>
          <input
            type="date"
            className="border rounded p-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Hasta</label>
          <input
            type="date"
            className="border rounded p-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setClientFilter("");
            setFromDate("");
            setToDate("");
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
          type="button"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Totales */}
      <div className="mb-6 space-x-6 text-lg font-semibold">
        <span>Total Debe: ${totalDebe.toFixed(2)}</span>
        <span>Total Haber: ${totalHaber.toFixed(2)}</span>
        <span>Saldo Actual: ${runningBalance.toFixed(2)}</span>
      </div>

      {/* Tabla */}
      <div className="overflow-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              {[
                "Cliente",
                "Fecha",
                "Vto",
                "Orden",
                "Recibo/Factura",
                "Promotor",
                "Debe",
                "Haber",
                "Saldo",
                "Acciones",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txsWithBalance.map((tx) => (
              <tr key={tx._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{tx.client?.name || "Desconocido"}</td>
                <td className="px-3 py-2">
                  {tx.date && new Date(tx.date).toLocaleDateString("es-AR")}
                </td>
                <td className="px-3 py-2">
                  {tx.dueDate ? new Date(tx.dueDate).toLocaleDateString("es-AR") : "-"}
                </td>
                <td className="px-3 py-2">{tx.orderNumber || "-"}</td>
                <td className="px-3 py-2">{tx.receiptOrInvoice || "-"}</td>
                <td className="px-3 py-2">{tx.promoter || "-"}</td>
                <td className="px-3 py-2 text-red-600 text-right">
                  {tx.debit ? `$${tx.debit.toFixed(2)}` : "-"}
                </td>
                <td className="px-3 py-2 text-green-600 text-right">
                  {tx.credit ? `$${tx.credit.toFixed(2)}` : "-"}
                </td>
                <td className="px-3 py-2 font-semibold text-right">
                  ${tx.runningBalance.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar transacción?")) {
                        axios
                          .delete(`${API_URL}/transactions/${tx._id}`)
                          .then(() => fetchData())
                          .catch(() => alert("Error al eliminar"));
                      }
                    }}
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
}
