// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/usuarios/dashboard', {
      headers: { Authorization: token }
    })
    .then(res => setMensaje(res.data.mensaje))
    .catch(() => setMensaje('Acceso denegado'));
  }, []);

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
}
