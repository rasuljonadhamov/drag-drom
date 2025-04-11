import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Navbar />
        <div className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/clients" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
