// src/services/usuarioService.js
import axios from 'axios';

const API = 'https://localhost:3000/api/usuarios';

export async function registrarUsuario(datos) {
  // { correo, contraseña, ... } 
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
  
  // data debe tener { token, usuario }
  // El bearer lo aplicamos después en App.jsx
  return data;
}
