import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    agency: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, agenciesRes] = await Promise.all([
        axios.get(`${API_URL}/clients`),
        axios.get(`${API_URL}/agencies`),
      ]);
      setClients(clientsRes.data);
      setAgencies(agenciesRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        agency: formData.agency || undefined,
      };

      await axios[editId ? "put" : "post"](
        `${API_URL}/clients/${editId || ""}`,
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );

      setFormData({ name: "", agency: "", email: "", phone: "" });
      setEditId(null);
      fetchData();
      toast.success(editId ? "Cliente actualizado" : "Cliente creado");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(`Error: ${err.response?.data?.message || "Error al guardar"}`);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name || "",
      agency: client.agency?._id || "",
      email: client.email || "",
      phone: client.phone || "",
    });
    setEditId(client._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Eliminar cliente?")) {
      try {
        await axios.delete(`${API_URL}/clients/${id}`);
        fetchData();
        toast.success("Cliente eliminado");
      } catch {
        toast.error("Error al eliminar cliente");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Clientes</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <select
            name="agency"
            value={formData.agency || ""}
            onChange={(e) => setFormData({ ...formData, agency: e.target.value || null })}
            className="border p-2 rounded"
          >
            <option value="">Sin agencia</option>
            {agencies.map((agency) => (
              <option key={agency._id} value={agency._id}>
                {agency.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Guardar cambios" : "Agregar"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Agencia</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.agency ? c.agency.name : "-"}</td>
                <td className="p-2">{c.email || "-"}</td>
                <td className="p-2">{c.phone || "-"}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline"
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
