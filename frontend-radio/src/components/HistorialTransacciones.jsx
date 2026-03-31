import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import TransactionForm from "./TransactionForm";
import { normalizeDateToString, formatDateLocal, formatDateForInput, compareDateStrings } from "../lib/dateUtils";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function HistorialTransacciones({ transactions, clients, fetchData }) {
  const [clientFilter, setClientFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingTx, setEditingTx] = useState(null);

  // FILTRO usando strings YYYY-MM-DD directamente
  const filteredTxs = transactions.filter((tx) => {
    if (clientFilter && tx.client?._id !== clientFilter) return false;

    const txDate = tx.date ? normalizeDateToString(tx.date) : "";
    if (fromDate && txDate && txDate < fromDate) return false;
    if (toDate && txDate && txDate > toDate) return false;

    return true;
  });

  let runningBalance = 0;
  let totalDebe = 0;
  let totalHaber = 0;

  const txsWithBalance = filteredTxs
    .sort((a, b) => compareDateStrings(a.date, b.date))
    .map((tx) => {
      totalDebe += tx.debit || 0;
      totalHaber += tx.credit || 0;
      runningBalance += (tx.credit || 0) - (tx.debit || 0);
      return { ...tx, runningBalance };
    });

  const exportExcel = () => {
    const data = txsWithBalance.map(tx => ({
      Cliente: tx.client?.name || "Desconocido",
      Fecha: tx.date ? formatDateLocal(tx.date) : "", 
      Vto: tx.dueDate ? formatDateLocal(tx.dueDate) : "",
      Orden: tx.orderNumber || "",
      "Recibo/Factura": tx.receiptOrInvoice || "",
      Promotor: tx.promoter || "",
      Debe: tx.debit || 0,
      Haber: tx.credit || 0,
      Saldo: tx.runningBalance || 0,
      Comisión: tx.vendorCommission || 0,
      "Ingreso Radio": tx.radioRevenue || 0,
      Descripción: tx.description || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "transacciones.xlsx");
  };

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
              <option key={c._id} value={c._id}>{c.name}</option>
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
        <span>Total Debe: ${totalDebe.toLocaleString("es-AR")}</span>
        <span>Total Haber: ${totalHaber.toLocaleString("es-AR")}</span>
        <span>Saldo Actual: ${runningBalance.toLocaleString("es-AR")}</span>
      </div>

      <button
        onClick={exportExcel}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Exportar Excel
      </button>

      {/* Tabla */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              {["Cliente","Fecha","Vto","Orden","Recibo/Factura","Promotor","Debe","Haber","Saldo","Acciones"].map(h => (
                <th key={h} className="px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txsWithBalance.map((tx) => (
              <tr key={tx._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{tx.client?.name || "Desconocido"}</td>
                <td className="px-3 py-2">{formatDateLocal(tx.date)}</td>
                <td className="px-3 py-2">{tx.dueDate ? formatDateLocal(tx.dueDate) : "-"}</td>
                <td className="px-3 py-2">{tx.orderNumber || "-"}</td>
                <td className="px-3 py-2">{tx.receiptOrInvoice || "-"}</td>
                <td className="px-3 py-2">{tx.promoter || "-"}</td>
                <td className="px-3 py-2 text-red-600 text-right">
                  {tx.debit ? `$${tx.debit.toLocaleString("es-AR")}` : "-"}
                </td>
                <td className="px-3 py-2 text-green-600 text-right">
                  {tx.credit ? `$${tx.credit.toLocaleString("es-AR")}` : "-"}
                </td>
                <td className="px-3 py-2 font-semibold text-right">
                  ${tx.runningBalance.toLocaleString("es-AR")}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setEditingTx(tx)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar transacción?")) {
                        axios.delete(`${API_URL}/transactions/${tx._id}`)
                          .then(() => {
                            toast.success("Transacción eliminada");
                            fetchData();
                          })
                          .catch(() => toast.error("Error al eliminar"));
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Editar Transacción</h3>
              <button
                onClick={() => setEditingTx(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <TransactionForm 
              initialData={editingTx} 
              isEdit={true} 
              editingId={editingTx._id}
              clients={clients}
              onSuccess={() => {
                setEditingTx(null);
                fetchData();
              }}
              onCancel={() => setEditingTx(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}