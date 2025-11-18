import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchContracts,
  createContract,
  updateContract,
  deleteContract,
  fetchContractsSummary,
} from "../api/contract";
import { Button } from "../components/ui/button";

const initialFormState = {
  advertiser: "",
  program: "",
  schedule: "",
  pricePerSlot: "",
  passesCount: "",
  startDate: "",
  endDate: "",
};

const initialSummaryFilters = {
  startDate: "",
  endDate: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

export default function Contracts() {
  const [formData, setFormData] = useState(initialFormState);
  const [contracts, setContracts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryFilters, setSummaryFilters] = useState(initialSummaryFilters);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadContracts = async () => {
    try {
      const { data } = await fetchContracts();
      setContracts(data);
    } catch (error) {
      console.error("Error cargando contratos", error);
      const msg = !error.response
        ? "No se pudo conectar con el backend. Verificá que esté corriendo y la variable REACT_APP_API_URL."
        : error.response?.data?.message || "No se pudieron cargar las publicidades";
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      advertiser: formData.advertiser.trim(),
      program: formData.program.trim(),
      schedule: formData.schedule.trim(),
      pricePerSlot: Number(formData.pricePerSlot),
      passesCount: Number(formData.passesCount),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
    };

    if (!payload.advertiser || !payload.program || !payload.schedule) {
      toast.error("Completá los datos obligatorios");
      setLoading(false);
      return;
    }

    if (Number.isNaN(payload.pricePerSlot) || payload.pricePerSlot <= 0) {
      toast.error("Ingresá un precio válido");
      setLoading(false);
      return;
    }

    if (Number.isNaN(payload.passesCount) || payload.passesCount <= 0) {
      toast.error("Ingresá la cantidad de pases");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        await updateContract(editingId, payload);
        toast.success("Publicidad actualizada");
      } else {
        await createContract(payload);
        toast.success("Publicidad creada");
      }
      setFormData(initialFormState);
      setEditingId(null);
      loadContracts();
    } catch (error) {
      console.error("Error guardando contrato", error);
      toast.error("No se pudo guardar la publicidad");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contract) => {
    setEditingId(contract._id);
    setFormData({
      advertiser: contract.advertiser || "",
      program: contract.program || "",
      schedule: contract.schedule || "",
      pricePerSlot: contract.pricePerSlot ?? "",
      passesCount: contract.passesCount ?? "",
      startDate: contract.startDate ? contract.startDate.substring(0, 10) : "",
      endDate: contract.endDate ? contract.endDate.substring(0, 10) : "",
    });
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta publicidad?"
    );
    if (!confirmDelete) return;

    try {
      await deleteContract(id);
      toast.success("Publicidad eliminada");
      loadContracts();
    } catch (error) {
      console.error("Error eliminando contrato", error);
      toast.error("No se pudo eliminar la publicidad");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSummaryChange = (event) => {
    const { name, value } = event.target;
    setSummaryFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSummarySubmit = async (event) => {
    event.preventDefault();
    setSummaryLoading(true);
    try {
      const params = {};
      if (summaryFilters.startDate) params.startDate = summaryFilters.startDate;
      if (summaryFilters.endDate) params.endDate = summaryFilters.endDate;
      const { data } = await fetchContractsSummary(params);
      setSummary(data);
    } catch (error) {
      console.error("Error obteniendo resumen", error);
      toast.error("No se pudo cargar el resumen");
    } finally {
      setSummaryLoading(false);
    }
  };

  const contractsTotal = useMemo(
    () =>
      contracts.reduce((acc, contract) => acc + Number(contract.total || 0), 0),
    [contracts]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <section className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Publicidades / Contratos
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="advertiser">
              Auspiciante
            </label>
            <input
              id="advertiser"
              name="advertiser"
              type="text"
              className="border rounded px-3 py-2"
              value={formData.advertiser}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="program">
              Programa
            </label>
            <input
              id="program"
              name="program"
              type="text"
              className="border rounded px-3 py-2"
              value={formData.program}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="schedule">
              Horario
            </label>
            <input
              id="schedule"
              name="schedule"
              type="text"
              className="border rounded px-3 py-2"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="Ej. Lun a Vie 10:00 - 12:00"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="pricePerSlot">
              Precio por tanda ($)
            </label>
            <input
              id="pricePerSlot"
              name="pricePerSlot"
              type="number"
              min="0"
              step="0.01"
              className="border rounded px-3 py-2"
              value={formData.pricePerSlot}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="passesCount">
              Cantidad de pases
            </label>
            <input
              id="passesCount"
              name="passesCount"
              type="number"
              min="1"
              step="1"
              className="border rounded px-3 py-2"
              value={formData.passesCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="startDate">
              Fecha de inicio
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="border rounded px-3 py-2"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="endDate">
              Fecha de fin (opcional)
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="border rounded px-3 py-2"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" disabled={loading}>
              {editingId ? "Actualizar" : "Guardar"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Publicidades cargadas
          </h2>
          <div className="text-sm text-gray-500">
            Total facturado (todas): {formatCurrency(contractsTotal)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="px-4 py-2">Auspiciante</th>
                <th className="px-4 py-2">Programa</th>
                <th className="px-4 py-2">Horario</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Pases</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Inicio</th>
                <th className="px-4 py-2">Fin</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-center" colSpan={9}>
                    No hay publicidades cargadas todavía.
                  </td>
                </tr>
              )}
              {contracts.map((contract) => (
                <tr key={contract._id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {contract.advertiser}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contract.program}</td>
                  <td className="px-4 py-3 text-gray-600">{contract.schedule}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatCurrency(contract.pricePerSlot)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contract.passesCount}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {formatCurrency(contract.total)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(contract.startDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(contract.endDate)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(contract)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(contract._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Reportes rápidos
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          onSubmit={handleSummarySubmit}
        >
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="startDateFilter">
              Fecha desde
            </label>
            <input
              id="startDateFilter"
              name="startDate"
              type="date"
              className="border rounded px-3 py-2"
              value={summaryFilters.startDate}
              onChange={handleSummaryChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium" htmlFor="endDateFilter">
              Fecha hasta
            </label>
            <input
              id="endDateFilter"
              name="endDate"
              type="date"
              className="border rounded px-3 py-2"
              value={summaryFilters.endDate}
              onChange={handleSummaryChange}
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" disabled={summaryLoading}>
              {summaryLoading ? "Consultando..." : "Ver resumen"}
            </Button>
          </div>
        </form>

        {summary && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded p-4">
              <p className="text-sm text-blue-700">Total facturado en el rango</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(summary.totalInRange)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Auspiciantes activos
              </h3>
              {summary.activeAdvertisers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No hay auspiciantes activos hoy.
                </p>
              ) : (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {summary.activeAdvertisers.map((advertiser) => (
                    <li key={advertiser}>{advertiser}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
