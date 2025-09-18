import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/clients", label: "Clientes" },
    { to: "/transactions", label: "Transacciones" },
    { to: "/agencies", label: "Agencias" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Radio Gestión</h2>
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded transition-colors ${
                location.pathname === link.to
                  ? "bg-blue-900 font-semibold"
                  : "hover:bg-blue-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
