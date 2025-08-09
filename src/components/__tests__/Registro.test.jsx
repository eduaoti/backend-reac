import { render, screen, fireEvent } from '@testing-library/react';
import Registro from '../Registro';
import * as userSvc from '../../services/usuarioService';

vi.mock('../../services/usuarioService');

describe('Registro', () => {
  test('valida campos y muestra errores', () => {
    render(<Registro cambiarVista={()=>{}} />);
    fireEvent.blur(screen.getByPlaceholderText(/nombre/i), { target:{ name:'nombre', value:'' }});
    expect(screen.getByText(/nombre requerido/i)).toBeInTheDocument();
  });

  test('registro paso 1 → avanza a paso 2', async () => {
    userSvc.registrarUsuario.mockResolvedValueOnce({ mensaje:'OK' });

    render(<Registro cambiarVista={()=>{}} />);

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target:{ name:'nombre', value:'Ana' }});
    fireEvent.change(screen.getByPlaceholderText('Apellido Paterno'), { target:{ name:'apellidoPaterno', value:'López' }});
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target:{ name:'correo', value:'a@a.com' }});
    const [pass, conf] = screen.getAllByPlaceholderText(/contraseña/i);
    fireEvent.change(pass, { target:{ name:'contraseña', value:'Aa123456!' }});
    fireEvent.change(conf, { target:{ name:'confirmar', value:'Aa123456!' }});

    fireEvent.click(screen.getByRole('button', { name:/enviar registro/i }));
    expect(await screen.findByText(/verifica tu correo/i)).toBeInTheDocument();
  });
});
