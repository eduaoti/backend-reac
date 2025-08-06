// src/services/tareaService.js
const API = 'http://localhost:3000/api/tareas'

export async function fetchTareas() {
  const r = await fetch(API)
  return r.json()
}
export async function addTarea(tarea) {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarea)
  })
}
export async function completarTarea(id) {
  await fetch(`${API}/${id}/cumplir`, { method: 'PUT' })
}
