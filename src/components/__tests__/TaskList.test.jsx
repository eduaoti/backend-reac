import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';

beforeAll(() => { vi.spyOn(window, 'alert').mockImplementation(()=>{}); });
afterAll(() => { window.alert.mockRestore(); });

describe('TaskList', () => {
  test('renderiza tareas y muestra nombres', () => {
    const now = new Date();
    const tasks = [
      { _id:'1', nombre:'A', prioridad:'medio', fechaLimite:new Date(now.getTime()+3e6).toISOString(), cumplida:false },
      { _id:'2', nombre:'B', prioridad:'alto',  fechaLimite:new Date(now.getTime()+4e6).toISOString(), cumplida:false },
    ];
    render(<TaskList tasks={tasks} onComplete={()=>{}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
