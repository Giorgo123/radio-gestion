import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ReportesTransacciones({ transactions = [] }) {
  // Si no hay transacciones, devolvemos un fallback
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Evolución del Saldo</h3>
        <p>No hay transacciones para mostrar.</p>
      </div>
    );
  }

  // Procesamos datos → saldo acumulado por fecha
  let runningBalance = 0;
  const chartData = [];
  let lastDate = null;

  transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((tx) => {
      runningBalance += (tx.credit || 0) - (tx.debit || 0);
      const d = new Date(tx.date).toLocaleDateString();

      if (lastDate !== d) {
        chartData.push({ date: d, saldo: runningBalance });
        lastDate = d;
      } else {
        chartData[chartData.length - 1].saldo = runningBalance;
      }
    });

  // Si no hay datos después del cálculo
  if (chartData.length === 0) {
    return (
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Evolución del Saldo</h3>
        <p>No hay datos suficientes para graficar.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Evolución del Saldo</h3>
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="saldo" fill="#3182ce" name="Saldo acumulado" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
