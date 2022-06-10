import { v4 } from 'uuid'
import './style.css'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
interface Task {
  id: string
  title: string
  description: string
}

const taskForm = document.querySelector<HTMLFormElement>('#taskForm')
const tasksList = document.querySelector<HTMLDivElement>('#tasksList')

let tasks: Task[] = []

taskForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  // captura los input
  const title = taskForm['title'] as unknown as HTMLInputElement
  const description = taskForm['description'] as unknown as HTMLTextAreaElement

  if (title.value === '' || description.value === '') {
    Toastify({
      text: 'Todos los campos son obligatorios', duration: 3000,

    }).showToast()
    return
  }

  // se guarda en el task
  tasks.push({
    id: v4(),
    title: title.value,
    description: description.value,
  })

  // enviar a local storaFge
  localStorage.setItem('tasks', JSON.stringify(tasks))
  Toastify({
    text: 'Tarea añadida',
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast()

  // renderizar el listado
  renderTasks(tasks)

  // limpiar datos
  taskForm.reset()
  title.focus()
})

// se lee las tareas cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
  renderTasks(tasks)
})

function renderTasks(tasks: Task[]) {
  // limpiar el html
  tasksList!.innerHTML = ''

  tasks.forEach((task) => {
    const taskElement = document.createElement('div')
    taskElement.className = 'bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer'

    const header = document.createElement('header')
    header.className = 'flex justify-between'

    const title = document.createElement('span')
    title.innerText = task.title

    const btnDelete = document.createElement('button')
    btnDelete.className = 'bg-red-500 px-2 py-1 rounded-md'
    btnDelete.innerText = 'Delete'

    // EVENTO DE ELIMINAR
    btnDelete.addEventListener('click', () => {
      console.log(task.id)
      let newTasks = tasks.filter(task => task.id !== task.id)
      localStorage.setItem('tasks', JSON.stringify(newTasks))
      renderTasks(newTasks)
    })

    header.append(title)
    header.append(btnDelete)

    const description = document.createElement('p')
    description.innerText = task.description

    taskElement.append(header)
    taskElement.append(description)

    const id = document.createElement('p')
    id.innerText = task.id
    id.className = 'text-gray-400 text-xs'
    taskElement.append(id)

    //insertar en la lista
    tasksList?.append(taskElement)


  })
}
