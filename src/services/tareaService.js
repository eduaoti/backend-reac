const API = 'http://localhost:3000/api/tareas';

function getToken() {
  return localStorage.getItem('token');
}

export async function fetchTareas() {
  const r = await fetch(API, {
    headers: { 'Authorization': getToken() }
  });
  return r.json();
}

export async function addTarea(tarea) {
  await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    },
    body: JSON.stringify(tarea)
  });
}

export async function completarTarea(id) {
  await fetch(`${API}/${id}/cumplir`, {
    method: 'PUT',
    headers: {
      'Authorization': getToken()
    }
  });
}
