const API = 'http://localhost:3000/api/usuarios';

export async function registrarUsuario(datos) {
  const res = await fetch(`${API}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function verificarOTP(correo, otp) {
  const res = await fetch(`${API}/verificar-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, otp })
  });
  return await res.json();
}

export async function login(correo, contraseña) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contraseña })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || 'Error al iniciar sesión');
  }

  return await res.json(); // contiene token y usuario
}
