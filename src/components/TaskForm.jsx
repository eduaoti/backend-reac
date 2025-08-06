import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import esLocale from 'date-fns/locale/es'
import './TaskForm.css'

export default function TaskForm({ onAdd }) {
  const [nombre, setNombre] = useState('')
  const [fechaHora, setFechaHora] = useState(null)
  const [colab, setColab] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (!nombre || !fechaHora) return
    onAdd({
      nombre,
      fechaLimite: fechaHora.toISOString(),
      colaborativa: colab
    })
    setNombre('')
    setFechaHora(null)
    setColab(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
      <form className="task-form" onSubmit={submit}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            label="Nombre"
            variant="filled"
            size="small"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            sx={{ minWidth: 200, bgcolor: 'rgba(255,255,255,0.1)' }}
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
                className: "date-time-picker",
                sx: { minWidth: 240, bgcolor: 'rgba(255,255,255,0.1)' }
              }
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={colab}
                onChange={e => setColab(e.target.checked)}
                sx={{ color: '#fff', '&.Mui-checked': { color: '#23c178' } }}
              />
            }
            label="Colaborativa"
            sx={{ color: '#fff' }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#23c178', '&:hover': { bgcolor: '#1ba85b' } }}
          >
            Agregar tarea
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  )
}
