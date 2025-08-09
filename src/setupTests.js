// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => (store[k] = String(v)),
  removeItem: (k) => delete store[k],
  clear: () => Object.keys(store).forEach(k => delete store[k]),
};

// alert
global.alert = vi.fn();

// rAF / cAF
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// matchMedia — MUI usa addEventListener/removeEventListener
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    addListener: () => {},           // compat vieja
    removeListener: () => {},
    addEventListener: () => {},      // API moderna
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Canvas mínimo
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
});

// --- Mock de MUI DateTimePicker (sin JSX) ---
vi.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: ({ label = 'Fecha y hora', value, onChange, slotProps }) =>
      React.createElement('input', {
        'aria-label': label,
        type: 'datetime-local',
        value: value ? new Date(value).toISOString().slice(0, 16) : '',
        onChange: (e) => onChange(new Date(e.target.value)),
        ...(slotProps?.textField || {}),
      }),
  };
});
