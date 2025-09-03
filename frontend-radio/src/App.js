// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
// import Navbar from './components/Navbar';
import Home from './pages/Home';
import Agencies from './pages/Agencies';
import Clients from './pages/Clients';
import Transactions from './pages/Transactions';
// import { Button } from './components/ui/button';  
import DashboardLayout from "./components/DashboardLayout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Routes>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </Router>
    
  );
}

export default App;