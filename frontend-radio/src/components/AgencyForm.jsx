import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";

export default function AgencyForm({ onAdd }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ingresá un nombre de agencia");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/agencies`, { name });
      toast.success("Agencia creada");
      setName("");
      if (onAdd) onAdd();
    } catch (err) {
      console.error("Error al agregar agencia:", err);
      toast.error("No se pudo crear la agencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow flex gap-4"
    >
      <input
        type="text"
        placeholder="Nombre de la agencia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}
