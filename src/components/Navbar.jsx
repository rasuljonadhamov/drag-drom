import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Test task</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:underline">Invoices</Link>
        <Link to="/clients" className="hover:underline">Clients</Link>
      </nav>
    </div>
  );
}
