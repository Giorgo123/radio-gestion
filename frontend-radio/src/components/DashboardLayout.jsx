import React from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Radio Gestión</h2>
        <nav className="space-y-4">
          <Link to="/" className="block hover:underline">Inicio</Link>
          <Link to="/clients" className="block hover:underline">Clientes</Link>
          <Link to="/transactions" className="block hover:underline">Transacciones</Link>
          <Link to="/agencies" className="block hover:underline">Agencias</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
