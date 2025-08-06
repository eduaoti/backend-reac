import { useState } from 'react';
import './TaskList.css';

export default function TaskList({ tasks, onComplete }) {
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const toggleSeleccion = (id) => {
    setTareaSeleccionada(prev => (prev === id ? null : id));
  };

  return (
    <div className="task-list">
      {tasks.map((t, i) => (
        <div
          key={t._id}
          className={`task-card ${tareaSeleccionada === t._id ? 'activa' : ''}`}
          onClick={() => toggleSeleccion(t._id)}
        >
          <div className="task-title">Tarea {i + 1}</div>

          {/* Solo renderiza esta sección si la tarjeta está seleccionada */}
          {tareaSeleccionada === t._id && (
            <div className="task-info">
              <div className="task-name">{t.nombre}</div>
              <div className="task-datetime">
                {new Date(t.fechaLimite).toLocaleString()}
              </div>
              <div className={`task-status ${t.cumplida ? 'done' : 'pending'}`}>
                {t.cumplida ? '✅ Completada' : '⏳ No completada'}
              </div>
              {!t.cumplida && (
                <button
                  className="complete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // evita que cierre al hacer clic
                    onComplete(t._id);
                  }}
                >
                  Marcar como completada ✓
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
