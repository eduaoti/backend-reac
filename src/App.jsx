// src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

import GalaxyBackground from './components/GalaxyBackground';
import LoginForm from './components/LoginForm';
import Registro from './components/Registro';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

import {
  fetchTareas,
  addTarea,
  completarTarea,
  obtenerPuntajeTotal
} from './services/tareaService';

import './App.css';

axios.defaults.baseURL = 'https://localhost:3000';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login');
  const [puntos, setPuntos] = useState(0);

  // ✅ Restaurar token y usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usr = localStorage.getItem('usuario');

    if (token && token !== 'undefined' && usr) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const userParsed = JSON.parse(usr);
        setUsuario(userParsed);
      } catch {
        console.error("❌ Error al parsear el usuario:", usr);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // ✅ Cargar tareas y puntaje si hay usuario restaurado
  useEffect(() => {
    if (usuario) {
      cargarTareas();
      cargarPuntaje();
    }
  }, [usuario]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
    setTareas([]);
    setPuntos(0);
  }

  async function cargarTareas() {
    try {
      const data = await fetchTareas();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      if (error.message.includes('Token')) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        logout();
      }
    }
  }

  async function cargarPuntaje() {
    try {
      const data = await obtenerPuntajeTotal();
      setPuntos(data.puntos || 0);
    } catch (error) {
      console.error('Error al obtener puntaje total:', error);
      if (error.message.includes('Token')) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        logout();
      }
    }
  }

  async function handleAdd(tarea) {
    await addTarea(tarea);
    cargarTareas();
    cargarPuntaje();
  }

  async function handleComplete(id, formData) {
    await completarTarea(id, formData);
    cargarTareas();
    cargarPuntaje();
  }

  return (
    <>
      <GalaxyBackground />
      <div className="contenedor-app">
        {!usuario ? (
          vista === 'login' ? (
            <LoginForm
              onLogin={async ({ token, usuario }) => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUsuario(usuario);
              }}
              cambiarVista={() => setVista('registro')}
            />
          ) : (
            <Registro cambiarVista={() => setVista('login')} />
          )
        ) : (
          <div className="contenedor-dashboard">
            <div className="dashboard-header">
              <h1 className="titulo-dashboard">Bienvenido, {usuario.nombre}</h1>
              <button className="boton-cerrar" onClick={logout}>
                Cerrar sesión
              </button>
            </div>

            <p className="puntos-usuario">
              🌟 Tu puntaje actual: <strong>{puntos}</strong>
            </p>

            <TaskForm onAdd={handleAdd} />
            <div className="tareas-contenedor">
              <TaskList tasks={tareas} onComplete={handleComplete} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
