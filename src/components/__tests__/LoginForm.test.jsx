import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import * as userSvc from '../../services/usuarioService';

vi.mock('../../services/usuarioService');

describe('LoginForm', () => {
  test('login exitoso llama onLogin', async () => {
    userSvc.login.mockResolvedValueOnce({ token:'t', usuario:{ nombre:'Ana' }});
    const onLogin = vi.fn();

    render(<LoginForm onLogin={onLogin} cambiarVista={() => {}} />);

    fireEvent.change(screen.getByLabelText(/correo/i), { target:{ value:'a@a.com' }});
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target:{ value:'123456!' }});
    fireEvent.click(screen.getByRole('button', { name:/entrar/i }));

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith({ token:'t', usuario:{ nombre:'Ana' }}));
  });

  test('muestra error cuando el servicio falla', async () => {
    userSvc.login.mockRejectedValueOnce(new Error('Credenciales inválidas'));
    render(<LoginForm onLogin={()=>{}} cambiarVista={()=>{}} />);

    fireEvent.change(screen.getByLabelText(/correo/i), { target:{ value:'a@a.com' }});
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target:{ value:'x' }});
    fireEvent.click(screen.getByRole('button', { name:/entrar/i }));

    expect(await screen.findByText(/credenciales inválidas|error al iniciar sesión/i)).toBeInTheDocument();
  });
});
