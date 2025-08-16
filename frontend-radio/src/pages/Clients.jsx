import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
    const [clientsRes, agenciesRes] = await Promise.all([
      axios.get(`${API_URL}/clients`),
      axios.get(`${API_URL}/agencies`),
    ]);
    setClients(clientsRes.data);
    setAgencies(agenciesRes.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    // Prepara los datos convirtiendo strings vacíos a null
    const dataToSend = {
      name: formData.name,
      email: formData.email || null,  // Convierte "" a null
      phone: formData.phone || null,  // Convierte "" a null
      agency: formData.agency || undefined // Convierte "" a null
    };

    const { data } = await axios[editId ? 'put' : 'post'](
      `${API_URL}/clients/${editId || ''}`,
      dataToSend,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log("Respuesta del servidor:", data); // 👈 Verifica respuesta
    
    // Reinicia el formulario
    setFormData({ name: "", agency: "", email: "", phone: "" });
    setEditId(null);
    
    // Vuelve a cargar los datos
    await fetchData();
    
    // Feedback visual
    alert(editId ? "Cliente actualizado" : "Cliente creado");
    
  } catch (err) {
    console.error("Error completo:", err.response?.data || err.message);
    alert(`Error: ${err.response?.data?.message || "Error al guardar"}`);
  }
};

  const handleEdit = (client) => {
      console.log("Editando cliente ID:", client._id); // 👈 Verifica en consola

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
      } catch {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Clientes</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <select
          name="agency"
          value={formData.agency || ""}
          onChange={(e) => setFormData({...formData, agency: e.target.value || null})}
          className="border p-2 rounded w-full"
        >
        <option value="">Sin agencia</option>
        {agencies.map(agency => (
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
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Guardar cambios" : "Agregar"}
        </button>
      </form>

      <table className="min-w-full bg-gray-100 rounded shadow">
        <thead>
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Agencia</th>
            <th className="p-2">Email</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c._id} className="border-t">
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
  );
}
