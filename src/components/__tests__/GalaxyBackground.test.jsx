import { render } from '@testing-library/react';
import GalaxyBackground from '../GalaxyBackground';

describe('GalaxyBackground', () => {
  test('renderiza el canvas', () => {
    const { container } = render(<GalaxyBackground />);
    const canvas = container.querySelector('canvas.galaxy-canvas');
    expect(canvas).toBeInTheDocument();
  });
});
