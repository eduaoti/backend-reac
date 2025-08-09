import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  test('envía tarea con datos mínimos', () => {
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target:{ value:'Nueva tarea' }});

    // MUI DateTimePicker: busca input asociado al label
    const dateInput = screen.getByLabelText(/fecha y hora/i);
    fireEvent.change(dateInput, { target:{ value:'2025-12-31T10:00' }});

    fireEvent.click(screen.getByRole('button', { name:/agregar tarea/i }));
    expect(onAdd).toHaveBeenCalled();
    const t = onAdd.mock.calls[0][0];
    expect(t.nombre).toBe('Nueva tarea');
  });

  test('colaborativa sin correo → alerta', () => {
    global.alert = vi.fn();
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target:{ value:'Colab' }});
    const dateInput = screen.getByLabelText(/fecha y hora/i);
    fireEvent.change(dateInput, { target:{ value:'2025-12-31T10:00' }});

    fireEvent.click(screen.getByLabelText(/colaborativa/i));
    fireEvent.click(screen.getByRole('button', { name:/agregar tarea/i }));

    expect(global.alert).toHaveBeenCalled();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
