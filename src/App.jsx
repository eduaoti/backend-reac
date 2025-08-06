import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { fetchTareas, addTarea, completarTarea } from './services/tareaService'
import './App.css'

export default function App() {
  const [tareas, setTareas] = useState([])

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const data = await fetchTareas()
    setTareas(data)
  }

  async function handleAdd(tarea) {
    await addTarea(tarea)
    cargar()
  }

  async function handleComplete(id) {
    await completarTarea(id)
    cargar()
  }

  return (
    <>
      <h1>Mis Tareas</h1>
      <TaskForm onAdd={handleAdd} />
      <TaskList tasks={tareas} onComplete={handleComplete} />
    </>
  )
}
