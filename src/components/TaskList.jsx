import { useEffect, useState, useRef } from 'react';
import './TaskList.css';

export default function TaskList({ tasks, onComplete }) {
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [ahora, setAhora] = useState(new Date());
  const tareasAlertadas = useRef(new Set());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const toggleSeleccion = (id) => {
    setTareaSeleccionada((prev) => (prev === id ? null : id));
  };

  const prioridadOrden = { alto: 1, medio: 2, bajo: 3 };
  const tareasOrdenadas = [...tasks].sort(
    (a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]
  );

  const calcularTiempoRestante = (t) => {
    const fin = new Date(t.fechaLimite);
    const diffMs = fin - ahora;

    if (diffMs <= 0) return '⚠️ Vencida';

    const segundos = Math.floor(diffMs / 1000) % 60;
    const minutos = Math.floor(diffMs / (1000 * 60)) % 60;
    const horas = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 1000 * 60 * 60 * 2 && !tareasAlertadas.current.has(t._id)) {
      alert(`🚨 La tarea '${t.nombre}' está por vencerse en menos de 2 horas.`);
      tareasAlertadas.current.add(t._id);
    }

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  return (
    <div className="task-list">
      {tareasOrdenadas.map((t, i) => {
        const seleccionada = tareaSeleccionada === t._id;
        const tiempoMs = new Date(t.fechaLimite) - ahora;
        const esInminente = tiempoMs > 0 && tiempoMs <= 1000 * 60 * 60 * 2;

        return (
          <div
            key={t._id}
            className={`task-card ${seleccionada ? 'activa' : ''} ${
              esInminente && !t.cumplida ? 'vencimiento-inminente' : ''
            }`}
            onClick={() => toggleSeleccion(t._id)}
          >
            <div className="task-header">
              <span className="task-index">Tarea {i + 1}</span>
              <span className={`badge prioridad ${t.prioridad}`}>{t.prioridad}</span>
            </div>

            <div className="task-info">
              <h3 className="task-name">{t.nombre}</h3>
              <p className="task-datetime">
                {new Date(t.fechaLimite).toLocaleString()}
              </p>

              {/* Mostrar cronómetro si NO está completada */}
              {!t.cumplida && (
                <p className="tiempo-restante">
                  ⏰ Tiempo restante: {calcularTiempoRestante(t)}
                </p>
              )}

              {/* Mostrar fecha de cumplimiento si está completada */}
              {t.cumplida && (
                <p className="task-status done">
                  ✅ Completada el:{' '}
                  {t.fechaCumplimiento
                    ? new Date(t.fechaCumplimiento).toLocaleString('es-MX', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'fecha no registrada'}
                </p>
              )}

              {seleccionada && (
                <p className={`task-status ${t.cumplida ? 'done' : 'pending'}`}>
                  {t.cumplida ? '✅ Completada' : '⏳ No completada'}
                </p>
              )}

              {t.cumplida && seleccionada && (
                <div className="resultados-tarea">
                  {t.imagenCompletada && (
                    <img
                      src={`https://localhost:3000/uploads/${t.imagenCompletada}`}
                      alt="Evidencia"
                      className="imagen-evidencia"
                    />
                  )}
                  {t.notas && (
                    <p className="notas-tarea">
                      <strong>Notas:</strong> {t.notas}
                    </p>
                  )}
                </div>
              )}

              {!t.cumplida && seleccionada && (
                <form
                  className="complete-form"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const imagen = form.imagen.files[0];
                    const notas = form.notas.value.trim();
                    if (!imagen || !notas) {
                      alert('Debes subir una imagen y escribir notas.');
                      return;
                    }
                    const formData = new FormData();
                    formData.append('imagen', imagen);
                    formData.append('notas', notas);
                    onComplete(t._id, formData);
                  }}
                >
                  <input type="file" name="imagen" accept="image/*" required />
                  <textarea
                    name="notas"
                    placeholder="Escribe tus notas aquí"
                    required
                  />
                  <button type="submit" className="complete-btn">
                    Subir y completar ✓
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
