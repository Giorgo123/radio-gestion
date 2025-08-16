// src/components/TransactionForm.jsx
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../config";
import { toast } from "react-toastify";

export default function TransactionForm({ onSuccess, clients }) {
  const [formData, setFormData] = useState({
    client: null,
    date: "",
    dueDate: "",
    orderNumber: "",
    receiptNumber: "",
    promoter: "",
    transactionType: "deuda",
    debit: "",
    credit: "",
  });

  const clientOptions = (clients || []).map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "transactionType") {
      setFormData((prev) => ({
        ...prev,
        transactionType: value,
        debit: value === "deuda" ? "" : prev.debit,
        credit: value === "pago" ? "" : prev.credit,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClientChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      client: selectedOption,
    }));
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
      client: formData.client.value,
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
        client: null,
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
        <label>Cliente:</label>
        <Select
          options={clientOptions}
          value={formData.client}
          onChange={handleClientChange}
          placeholder="Seleccionar cliente"
          isClearable
        />
      </div>

      <div>
        <label>Tipo de transacción:</label>
        <select
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
        <label>Fecha:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label>Número de orden:</label>
        <input
          type="text"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label>N° Comprobante / Factura:</label>
        <input
          type="text"
          name="receiptNumber"
          value={formData.receiptNumber}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label>Promotor / Agencia:</label>
        <input
          type="text"
          name="promoter"
          value={formData.promoter}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {formData.transactionType === "deuda" && (
        <div>
          <label>Debe ($):</label>
          <input
            type="number"
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
          <label>Haber ($):</label>
          <input
            type="number"
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
