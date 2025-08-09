import axios from 'axios';

// ❌ NO pongas dominio aquí
const API = '/api/usuarios';

export async function registrarUsuario(datos) {
  const { data } = await axios.post(`${API}/registrar`, datos, {
    headers: { 'Content-Type': 'application/json' }
  });
  return data;
}

export async function verificarOTP(correo, otp) {
  const { data } = await axios.post(
    `${API}/verificar-otp`,
    { correo, otp },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function login(correo, contraseña) {
  const { data } = await axios.post(
    `${API}/login`,
    { correo, contraseña },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function restarPuntos(cantidad, token) {
  const { data } = await axios.post(
    `${API}/restar-puntos`,
    { puntos: cantidad },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  return data;
}

export async function obtenerSaldo(token) {
  const { data } = await axios.get(`${API}/saldo`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
