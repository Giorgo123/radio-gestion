import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";

export default function TransactionForm({ onSuccess, clients }) {
  const [formData, setFormData] = useState({
    client: "",
    date: "",
    dueDate: "",
    orderNumber: "",
    receiptNumber: "",
    promoter: "",
    transactionType: "deuda",
    debit: "",
    credit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "transactionType") {
      setFormData((prev) => ({
        ...prev,
        transactionType: value,
        debit: value === "deuda" ? prev.debit : "",
        credit: value === "pago" ? prev.credit : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      toast.error("Seleccioná un cliente.");
      return;
    }

    const amount =
      formData.transactionType === "deuda"
        ? Number(formData.debit)
        : Number(formData.credit);

    if (!amount || amount <= 0) {
      toast.error("Ingresá un monto válido.");
      return;
    }

    const data = {
      client: formData.client,
      type: formData.transactionType,
      amount,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      ...(formData.dueDate ? { dueDate: new Date(formData.dueDate).toISOString() } : {}),
      orderNumber: formData.orderNumber || undefined,
      receiptOrInvoice: formData.receiptNumber || undefined,
      promoter: formData.promoter || undefined,
    };

    try {
      await axios.post(`${API_URL}/transactions`, data);
      toast.success("Transacción creada!");
      setFormData({
        client: "",
        date: "",
        dueDate: "",
        orderNumber: "",
        receiptNumber: "",
        promoter: "",
        transactionType: "deuda",
        debit: "",
        credit: "",
      });
      onSuccess();
    } catch (err) {
      console.error("Error al enviar transacción:", err);
      toast.error("Error al crear transacción");
    }
  };

  return (
<form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
  <h2 className="text-lg font-semibold">Nueva Transacción</h2>

  <div>
    <label htmlFor="client">Cliente:</label>
    <select
      id="client"
      name="client"
      value={formData.client}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">Seleccionar cliente</option>
      {clients.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="transactionType">Tipo de transacción:</label>
    <select
      id="transactionType"
      name="transactionType"
      value={formData.transactionType}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    >
      <option value="deuda">Deuda</option>
      <option value="pago">Pago</option>
    </select>
  </div>

  <div>
    <label htmlFor="date">Fecha:</label>
    <input
      type="date"
      id="date"
      name="date"
      value={formData.date}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      required
    />
  </div>

  <div>
    <label htmlFor="dueDate">Fecha de vencimiento:</label>
    <input
      type="date"
      id="dueDate"
      name="dueDate"
      value={formData.dueDate}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="orderNumber">Número de orden:</label>
    <input
      type="text"
      id="orderNumber"
      name="orderNumber"
      value={formData.orderNumber}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="receiptNumber">N° Comprobante / Factura:</label>
    <input
      type="text"
      id="receiptNumber"
      name="receiptNumber"
      value={formData.receiptNumber}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="promoter">Promotor / Agencia:</label>
    <input
      type="text"
      id="promoter"
      name="promoter"
      value={formData.promoter}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  {formData.transactionType === "deuda" && (
    <div>
      <label htmlFor="debit">Debe ($):</label>
      <input
        type="number"
        id="debit"
        name="debit"
        value={formData.debit}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
        min="0"
        step="0.01"
      />
    </div>
  )}

  {formData.transactionType === "pago" && (
    <div>
      <label htmlFor="credit">Haber ($):</label>
      <input
        type="number"
        id="credit"
        name="credit"
        value={formData.credit}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
        min="0"
        step="0.01"
      />
    </div>
  )}

  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Cargar
  </button>
</form>
  );
}
