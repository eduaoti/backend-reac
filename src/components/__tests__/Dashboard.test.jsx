import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import axios from 'axios';
vi.mock('axios');

describe('Dashboard', () => {
  test('muestra mensaje de éxito', async () => {
    axios.get.mockResolvedValueOnce({ data:{ mensaje:'Bienvenido!' }});
    render(<Dashboard />);
    expect(await screen.findByText(/Bienvenido!/i)).toBeInTheDocument();
  });

  test('muestra Acceso denegado en error', async () => {
    axios.get.mockRejectedValueOnce(new Error('401'));
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Acceso denegado/i)).toBeInTheDocument());
  });
});
