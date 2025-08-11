import { API_BASE } from '../config';

const API = `${API_BASE}/api/tareas`;

function getTokenHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const errorText = await response.text();
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Respuesta no válida: ${errorText}`);
    }
    const errorJson = JSON.parse(errorText);
    throw new Error(errorJson.mensaje || 'Error desconocido');
  }
  return response.json();
}

export async function fetchTareas() {
  const res = await fetch(API, { headers: getTokenHeader() });
  return handleResponse(res);
}

export async function addTarea(tarea) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getTokenHeader() },
    body: JSON.stringify(tarea)
  });
  return handleResponse(res);
}

export async function completarTarea(id, formData) {
  const res = await fetch(`${API}/${id}/cumplir`, {
    method: 'PUT',
    headers: getTokenHeader(), // NO pongas Content-Type con FormData
    body: formData
  });
  return handleResponse(res);
}

export async function obtenerPuntajeTotal() {
  const res = await fetch(`${API}/puntos/total`, { headers: getTokenHeader() });
  return handleResponse(res);
}
