import { useState, useEffect, useRef } from 'react';
import './Recompensas.css';

const RECOMPENSAS = [
  { id: 1, nombre: '10 min de TikTok', costo: 50, minutos: 10 },
  { id: 2, nombre: '30 min de juego', costo: 100, minutos: 30 },
  { id: 3, nombre: '1 hora libre', costo: 200, minutos: 60 },
  { id: 4, nombre: '2 horas sin tareas', costo: 300, minutos: 120 },
  { id: 5, nombre: 'Día sin tareas', costo: 500, minutos: 1440 },
];

export default function Recompensas({ puntos, restarPuntos, onClose }) {
  const [recompensaActiva, setRecompensaActiva] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [confirmarSalir, setConfirmarSalir] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    let timer;
    if (tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante(prev => prev - 1);
      }, 60000);
    }
    if (tiempoRestante === 0 && recompensaActiva) {
      alert(`⏰ Se terminó el tiempo de: ${recompensaActiva.nombre}`);
      setRecompensaActiva(null);
    }
    return () => clearInterval(timer);
  }, [tiempoRestante, recompensaActiva]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (recompensaActiva) {
          setConfirmarSalir(true);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, recompensaActiva]);

  const canjearRecompensa = (r) => {
    if (recompensaActiva) return alert('⚠️ Ya tienes una recompensa activa.');
    if (puntos < r.costo) return alert('❌ No tienes suficientes puntos');

    restarPuntos(Number(r.costo)); // 🔧 ¡Aquí se fuerza el tipo number!
    setRecompensaActiva(r);
    setTiempoRestante(r.minutos);
  };

  const cancelarRecompensa = () => {
    setRecompensaActiva(null);
    setTiempoRestante(0);
    setConfirmarSalir(false);
    onClose();
  };

  return (
    <div className="modal-recompensas">
      <div className="contenido-modal" ref={modalRef}>
        <button
          className="cerrar-modal"
          onClick={() => {
            if (recompensaActiva) {
              setConfirmarSalir(true);
            } else {
              onClose();
            }
          }}
        >
          ✖
        </button>

        <h2>🎁 Canjear Recompensas</h2>
        <p className="puntos-actuales">⭐ Puntos disponibles: {puntos}</p>

        {recompensaActiva && (
          <div className="recompensa-activa">
            <h3>⏱️ {recompensaActiva.nombre}</h3>
            <p>⏳ Tiempo restante: {tiempoRestante} min</p>
          </div>
        )}

        <ul className="lista-recompensas">
          {RECOMPENSAS.map((r) => (
            <li key={r.id} className="recompensa-item">
              <div>
                <strong>{r.nombre}</strong>
                <p>🎯 {r.costo} puntos - ⏳ {r.minutos} min</p>
              </div>
              <button
                onClick={() => canjearRecompensa(r)}
                disabled={!!recompensaActiva}
              >
                Canjear
              </button>
            </li>
          ))}
        </ul>
      </div>

      {confirmarSalir && (
        <div className="confirmar-salida">
          <p>
            ¿Seguro que quieres salir? Aún te quedan {tiempoRestante} minutos de recompensa.
          </p>
          <button onClick={() => setConfirmarSalir(false)}>Quedarme</button>
          <button className="salir-btn" onClick={cancelarRecompensa}>Salir</button>
        </div>
      )}
    </div>
  );
}
