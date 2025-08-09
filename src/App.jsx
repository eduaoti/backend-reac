import { useEffect, useState } from 'react';
import axios from 'axios';

import GalaxyBackground from './components/GalaxyBackground';
import Inicio from './components/Inicio';
import LoginForm from './components/LoginForm';
import Registro from './components/Registro';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Recompensas from './components/Recompensas';

import {
  fetchTareas,
  addTarea,
  completarTarea
} from './services/tareaService';

import {
  restarPuntos as restarPuntosAPI,
  obtenerSaldo
} from './services/usuarioService';

import './App.css';


export default function App() {
  const [tareas, setTareas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('inicio');
  const [puntos, setPuntos] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

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

  useEffect(() => {
    if (usuario) {
      cargarTareas();
      cargarSaldo();
    }
  }, [usuario]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
    setTareas([]);
    setPuntos(0);
    setVista('inicio');
  }

  async function cargarTareas() {
    try {
      const data = await fetchTareas();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      if (String(error?.message || '').includes('Token')) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        logout();
      }
    }
  }

  async function cargarSaldo() {
    try {
      const token = localStorage.getItem('token');
      const data = await obtenerSaldo(token);
      setPuntos(data.disponibles || 0);
    } catch (error) {
      console.error('Error al obtener saldo:', error);
      if (String(error?.message || '').includes('Token')) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        logout();
      }
    }
  }

  async function handleAdd(tarea) {
    await addTarea(tarea);
    cargarTareas();
    cargarSaldo();
  }

  async function handleComplete(id, formData) {
    await completarTarea(id, formData);
    cargarTareas();
    cargarSaldo();
  }

  async function restarPuntos(cantidad) {
    try {
      const token = localStorage.getItem('token');
      const puntosNumericos = Number(cantidad);

      if (isNaN(puntosNumericos)) {
        throw new Error('La cantidad de puntos no es un número válido');
      }

      const { puntosDisponibles } = await restarPuntosAPI(puntosNumericos, token);
      setPuntos(puntosDisponibles);
    } catch (error) {
      console.error("❌ Error al canjear recompensa:", error?.response?.data || error.message);
      alert(error?.response?.data?.mensaje || "Ocurrió un error al canjear la recompensa");
    }
  }

  return (
    <>
      <GalaxyBackground />
      <div className="contenedor-app">
        {!usuario ? (
          vista === 'inicio' ? (
            <Inicio
              onLoginClick={() => setVista('login')}
              onRegisterClick={() => setVista('registro')}
            />
          ) : vista === 'login' ? (
            <LoginForm
              onLogin={async ({ token, usuario }) => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('token', token);
                localStorage.setItem('usuario', JSON.stringify(usuario));
                setUsuario(usuario);

                try {
                  const { disponibles } = await obtenerSaldo(token);
                  setPuntos(disponibles || 0);
                } catch (e) {
                  console.error('No se pudo cargar saldo tras login:', e);
                }
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

            <button className="boton-canjear" onClick={() => setMostrarModal(true)}>
              Canjear puntos
            </button>

            <TaskForm onAdd={handleAdd} />
            <div className="tareas-contenedor">
              <TaskList tasks={tareas} onComplete={handleComplete} />
            </div>

            {mostrarModal && (
              <Recompensas
                puntos={puntos}
                restarPuntos={restarPuntos}
                onClose={() => setMostrarModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
