import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";

const createInitialState = () => ({
  clientId: "",
  type: "deuda",
  date: new Date().toISOString().slice(0, 10),
  dueDate: "",
  orderNumber: "",
  receiptOrInvoice: "",
  promoter: "",
  amount: "",
});

export default function TransactionForm({ onSuccess, clients }) {
  const [formData, setFormData] = useState(createInitialState);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        amount: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.clientId) {
      toast.error("Seleccioná un cliente.");
      return;
    }

    const numericAmount = Number(formData.amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Ingresá un monto válido.");
      return;
    }

    const transactionDate = formData.date ? new Date(formData.date) : null;
    if (!transactionDate || Number.isNaN(transactionDate.getTime())) {
      toast.error("Ingresá una fecha válida.");
      return;
    }

    let dueDateValue;
    if (formData.dueDate) {
      const parsedDueDate = new Date(formData.dueDate);
      if (Number.isNaN(parsedDueDate.getTime())) {
        toast.error("Ingresá una fecha de vencimiento válida.");
        return;
      }
      dueDateValue = parsedDueDate.toISOString();
    }

    const payload = {
      client: formData.clientId,
      type: formData.type,
      amount: numericAmount,
      date: transactionDate.toISOString(),
      ...(dueDateValue ? { dueDate: dueDateValue } : {}),
      orderNumber: formData.orderNumber?.trim() || undefined,
      receiptOrInvoice: formData.receiptOrInvoice?.trim() || undefined,
      promoter: formData.promoter?.trim() || undefined,
    };

    try {
      await axios.post(`${API_URL}/transactions`, payload);
      toast.success("Transacción creada!");
      setFormData(createInitialState());
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error al enviar transacción:", err);
      toast.error(err.response?.data?.message || "Error al crear transacción");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Nueva Transacción</h2>

      <div>
        <label htmlFor="clientId">Cliente:</label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Seleccionar cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type">Tipo de transacción:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
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
        <label htmlFor="receiptOrInvoice">N° Comprobante / Factura:</label>
        <input
          type="text"
          id="receiptOrInvoice"
          name="receiptOrInvoice"
          value={formData.receiptOrInvoice}
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

      <div>
        <label htmlFor="amount">
          {formData.type === "deuda" ? "Debe ($):" : "Haber ($):"}
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
          min="0"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cargar
      </button>
    </form>
  );
}
