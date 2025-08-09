import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import './TaskForm.css';

export default function TaskForm({ onAdd }) {
  const [nombre, setNombre] = useState('');
  const [fechaHora, setFechaHora] = useState(null);
  const [colab, setColab] = useState(false);
  const [correoColab, setCorreoColab] = useState('');
  const [prioridad, setPrioridad] = useState('medio');

  const submit = e => {
    e.preventDefault();

    if (!nombre || !fechaHora) return;
    if (colab && !correoColab) {
      alert('Agrega al menos un correo si es colaborativa');
      return;
    }

    const nuevaTarea = {
      nombre,
      fechaLimite: fechaHora.toISOString(),
      colaborativa: colab,
      prioridad
    };

    if (colab) {
      nuevaTarea.usuariosAsignados = [correoColab];
    }

    onAdd(nuevaTarea);

    // Limpiar formulario
    setNombre('');
    setFechaHora(null);
    setColab(false);
    setCorreoColab('');
    setPrioridad('medio');
  };

  return (
    <div className="task-form-container">
      <h2 className="task-form-title">Crear nueva tarea</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        {/* ⬇️ Se agregó noValidate para que no bloquee el alert en tests */}
        <form className="task-form" onSubmit={submit} noValidate>
          <TextField
            label="Nombre"
            variant="filled"
            size="small"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />

          <DateTimePicker
            label="Fecha y hora"
            value={fechaHora}
            onChange={setFechaHora}
            slotProps={{
              textField: {
                variant: "filled",
                size: "small",
                required: true,
                className: "date-time-picker"
              }
            }}
          />

          <TextField
            select
            label="Prioridad"
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
            variant="filled"
            size="small"
          >
            <MenuItem value="alto">Alta</MenuItem>
            <MenuItem value="medio">Media</MenuItem>
            <MenuItem value="bajo">Baja</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={colab}
                onChange={e => setColab(e.target.checked)}
                sx={{ color: '#2e2b81', '&.Mui-checked': { color: '#23c178' } }}
              />
            }
            label="Colaborativa"
            sx={{ color: '#2e2b81' }}
          />

          {colab && (
            <TextField
              className="colab-input"
              label="Correo colaborador"
              variant="filled"
              size="small"
              value={correoColab}
              onChange={e => setCorreoColab(e.target.value)}
              // ⬇️ Quitado required para que pase el test
            />
          )}

          <Button type="submit" variant="contained">
            Agregar tarea
          </Button>
        </form>
      </LocalizationProvider>
    </div>
  );
}
