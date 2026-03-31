import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { capitalizeStart } from "../lib/utils";

const todayLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createInitialState = () => ({
  clientId: "",
  type: "deuda",
  date: todayLocal(),
  dueDate: "",
  orderNumber: "",
  receiptOrInvoice: "",
  promoter: "",
  amount: "",
  vendorCommission: "",
  radioRevenue: "",
  description: ""
});

const populateFromData = (data) => ({
  clientId: data.client?._id || "",
  type: data.debit > 0 ? "deuda" : "pago",
  amount: Math.max(data.debit || 0, data.credit || 0).toString(),
  date: data.date || todayLocal(),
  dueDate: data.dueDate || "",
  orderNumber: data.orderNumber || "",
  receiptOrInvoice: data.receiptOrInvoice || "",
  promoter: data.promoter || "",
  vendorCommission: data.vendorCommission || "",
  radioRevenue: data.radioRevenue || "",
  description: data.description || ""
});

export default function TransactionForm({ 
  onSuccess, 
  clients, 
  initialData = null, 
  isEdit = false, 
  editingId = null,
  onCancel 
}) {
  const [formData, setFormData] = useState(
    initialData ? populateFromData(initialData) : createInitialState()
  );

  useEffect(() => {
    if (initialData) {
      setFormData(populateFromData(initialData));
    } else {
      setFormData(createInitialState());
    }
  }, [initialData]);

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

    const capitalizableFields = new Set(["orderNumber", "receiptOrInvoice", "promoter"]);
    const nextValue = capitalizableFields.has(name) ? capitalizeStart(value) : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.clientId) {
      toast.error("Selecciona un cliente.");
      return;
    }

    const numericAmount = Number(formData.amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Ingresá un monto válido.");
      return;
    }

    const payload = {
      client: formData.clientId,
      type: formData.type,
      amount: numericAmount,
      date: formData.date,            // YYYY-MM-DD directo
      dueDate: formData.dueDate || undefined,
      orderNumber: formData.orderNumber?.trim() || undefined,
      receiptOrInvoice: formData.receiptOrInvoice?.trim() || undefined,
      promoter: formData.promoter?.trim() || undefined,
      vendorCommission: Number(formData.vendorCommission || 0),
      radioRevenue: Number(formData.radioRevenue || 0),
      description: formData.description
    };

    try {
      if (isEdit && editingId) {
        await axios.put(`${API_URL}/transactions/${editingId}`, payload);
        toast.success("Transacción actualizada!");
      } else {
        await axios.post(`${API_URL}/transactions`, payload);
        toast.success("Transacción creada!");
        setFormData(createInitialState());
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error al guardar transacción:", err);
      toast.error(err.response?.data?.message || "Error al guardar transacción");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{isEdit ? "Editar Transacción" : "Nueva Transacción"}</h2>

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
            <option key={client._id} value={client._id}>{client.name}</option>
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
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded w-full" required />
      </div>

      <div>
        <label htmlFor="dueDate">Fecha de vencimiento:</label>
        <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="orderNumber">Número de orden:</label>
        <input type="text" id="orderNumber" name="orderNumber" value={formData.orderNumber} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="receiptOrInvoice">N° Comprobante / Factura:</label>
        <input type="text" id="receiptOrInvoice" name="receiptOrInvoice" value={formData.receiptOrInvoice} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="promoter">Promotor / Agencia:</label>
        <input type="text" id="promoter" name="promoter" value={formData.promoter} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="amount">{formData.type === "deuda" ? "Debe ($):" : "Haber ($):"}</label>
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="border p-2 rounded w-full" required min="0" step="0.01" />
      </div>

      <div>
        <label htmlFor="vendorCommission">Comisión Vendedor ($):</label>
        <input type="number" id="vendorCommission" name="vendorCommission" value={formData.vendorCommission} onChange={handleChange} className="border p-2 rounded w-full" min="0" step="0.01" />
      </div>

      <div>
        <label htmlFor="radioRevenue">Ingreso Radio ($):</label>
        <input type="number" id="radioRevenue" name="radioRevenue" value={formData.radioRevenue} onChange={handleChange} className="border p-2 rounded w-full" min="0" step="0.01" />
      </div>

      <div>
        <label htmlFor="description">Descripción:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full" rows="3" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1">
          {isEdit ? "Actualizar" : "Cargar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
        )}
      </div>
    </form>
  );
}