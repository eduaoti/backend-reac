import { render, screen, fireEvent } from '@testing-library/react';
import Recompensas from '../Recompensas';

beforeEach(() => { global.alert = vi.fn(); });

describe('Recompensas', () => {
  test('muestra puntos y lista', () => {
    render(<Recompensas puntos={150} restarPuntos={()=>{}} onClose={()=>{}} />);
    expect(screen.getByText(/puntos disponibles:\s*150/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name:/canjear/i }).length).toBeGreaterThan(0);
  });

  test('canjea recompensa si alcanza los puntos', () => {
    const restarPuntos = vi.fn();
    render(<Recompensas puntos={500} restarPuntos={restarPuntos} onClose={()=>{}} />);
    fireEvent.click(screen.getAllByRole('button', { name:/canjear/i })[0]);
    expect(restarPuntos).toHaveBeenCalled();
    expect(screen.getByText(/tiempo restante:/i)).toBeInTheDocument();
  });

  test('alcanza puntos insuficientes → alerta', () => {
    render(<Recompensas puntos={0} restarPuntos={()=>{}} onClose={()=>{}} />);
    fireEvent.click(screen.getAllByRole('button', { name:/canjear/i })[0]);
    expect(global.alert).toHaveBeenCalled();
  });
});
