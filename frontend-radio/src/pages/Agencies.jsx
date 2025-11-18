import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [agencyName, setAgencyName] = useState("");

  const loadAgencies = async () => {
    try {
      const res = await axios.get(`${API_URL}/agencies`);
      setAgencies(res.data);
    } catch (err) {
      console.error("Error cargando agencias:", err);
      const msg = !err.response
        ? "No se pudo conectar con el backend. Verificá que esté corriendo y la variable REACT_APP_API_URL."
        : err.response?.data?.message || "No se pudieron cargar las agencias";
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadAgencies();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!agencyName.trim()) {
      toast.error("Ingresá el nombre de la agencia");
      return;
    }

    try {
      await axios.post(`${API_URL}/agencies`, { name: agencyName });
      setAgencyName("");
      loadAgencies();
      toast.success("Agencia agregada");
    } catch (err) {
      console.error("Error al agregar agencia:", err);
      toast.error(err.response?.data?.message || "No se pudo agregar la agencia");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar agencia?")) return;
    try {
      await axios.delete(`${API_URL}/agencies/${id}`);
      loadAgencies();
      toast.success("Agencia eliminada");
    } catch (err) {
      console.error("Error al eliminar agencia:", err);
      toast.error(err.response?.data?.message || "No se pudo eliminar la agencia");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Agencias</h2>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Nueva agencia"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((a) => (
              <tr key={a._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {agencies.length === 0 && (
              <tr>
                <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                  No hay agencias cargadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
