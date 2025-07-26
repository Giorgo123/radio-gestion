// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#282c34', padding: '10px' }}>
    <Link to="/" style={linkStyle}>Inicio</Link> |{' '}
    <Link to="/agencies" style={linkStyle}>Agencias</Link> |{' '}
    <Link to="/clients" style={linkStyle}>Clientes</Link> |{' '}
    <Link to="/transactions" style={linkStyle}>Transacciones</Link>
  </nav>
);

const linkStyle = {
  color: '#61dafb',
  textDecoration: 'none',
  marginRight: '15px'
};

export default Navbar;
