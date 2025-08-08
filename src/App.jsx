import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';
import Registro from './components/Registro';
import GalaxyBackground from './components/GalaxyBackground';
import { fetchTareas, addTarea, completarTarea } from './services/tareaService';
import axios from 'axios';
import './App.css';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/usuarios/dashboard', {
          headers: { Authorization: token },
        })
        .then((res) => {
          setUsuario({ nombre: res.data.mensaje });
          cargar();
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  async function cargar() {
    const data = await fetchTareas();
    setTareas(data);
  }

  async function handleAdd(tarea) {
    await addTarea(tarea);
    cargar();
  }

  async function handleComplete(id) {
    await completarTarea(id);
    cargar();
  }

  return (
    <>
      <GalaxyBackground />
      <div className="contenedor-app">
        {!usuario ? (
          <>
            {vista === 'login' && (
              <LoginForm
                onLogin={setUsuario}
                cambiarVista={() => setVista('registro')}
              />
            )}
            {vista === 'registro' && (
              <Registro cambiarVista={() => setVista('login')} />
            )}
          </>
        ) : (
          <div className="contenedor-dashboard">
            <div className="dashboard-header">
              <h1 className="titulo-dashboard">Bienvenido, {usuario.nombre}</h1>
              <button
                className="boton-cerrar"
                onClick={() => {
                  localStorage.removeItem('token');
                  setUsuario(null);
                }}
              >
                Cerrar sesión
              </button>
            </div>

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
