const inputText = document.getElementById('inputText')
const button = document.getElementById('button')
const buttonClearAll = document.getElementById('buttonClearAll')
const buttonClearChecked = document.getElementById('buttonClearChecked')
const app = document.getElementById('app')
const select = document.getElementById('select')
const inputSearch = document.getElementById('input__search')

const arrayOfToDo = [
  {
    name: 'Wait first',
    status: false,
  },
  {
    name: 'Go then',
    status: false,
  },
  {
    name: 'Arriva',
    status: false,
  },
]

button.addEventListener('click', () => {
  // add new todo/wrong if emptys
  if (inputText.value) {
    inputText.classList.remove('container__inputTodo_inputText_wrong')
    arrayOfToDo.push({ name: inputText.value, status: false })
  } else {
    inputText.classList.add('container__inputTodo_inputText_wrong')
  }

  renderToDo(arrayOfToDo)
})

buttonClearAll.addEventListener('click', () => {
  // clear all todos
  arrayOfToDo.length = 0
  renderToDo(arrayOfToDo)
})

buttonClearChecked.addEventListener('click', () => {
  // clear all checked todos
  let checkedTodos = arrayOfToDo.filter((el) => !el.status)
  renderToDo(checkedTodos)
})

select.addEventListener('change', (e) => {
  // sort by name
  if (e.target.value === 'name') {
    arrayOfToDo.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    )
  }
  renderToDo(arrayOfToDo)
})

inputSearch.addEventListener('input', (e) => {
  // search by input value
  let value = e.target.value
  let searchedArray = arrayOfToDo.filter((el) =>
    el.name.toLowerCase().includes(value.toLowerCase())
  )
  renderToDo(searchedArray)
})

const deleteElem = (name) => {
  // delete todo element from arrayOfTodos
  let indexDel
  arrayOfToDo.forEach((item, index) => {
    if (item.name === name) {
      indexDel = index
    }
  })
  arrayOfToDo.splice(indexDel, 1)
  renderToDo(arrayOfToDo)
}

const isStatusTrue = (status, name) => {
  // toggle status in checkbox
  arrayOfToDo.forEach((el) => {
    if (el.name === name) el.status = !status
  })
  renderToDo(arrayOfToDo)
}

const renderToDo = (arr) => {
  app.innerHTML = '' // clear app, then append items with changes

  arr.forEach((todo, index) => {
    const div = document.createElement('div')
    div.classList.add('container__app_todo-container')
    const divTodoContainer = document.createElement('div')
    const paragraph = document.createElement('p')
    const checkbox = document.createElement('input')
    const deleteButton = document.createElement('button')

    deleteButton.textContent = 'delete'
    paragraph.textContent = todo.name
    paragraph.id = 'paragraph'

    checkbox.type = 'checkbox'
    checkbox.name = 'name'
    checkbox.value = 'value'
    checkbox.id = 'id'
    checkbox.checked = todo.status

    div.append(paragraph)
    div.append(divTodoContainer)
    divTodoContainer.append(checkbox)
    divTodoContainer.append(deleteButton)
    app.appendChild(div)

    if (todo.status) {
      // change style if we toggle status on true
      let taskTodoParagraphCollection = document.querySelectorAll('#paragraph')
      for (const p of taskTodoParagraphCollection) {
        if (p.textContent === todo.name)
          p.classList.toggle('container__app_todo_checked')
      }
    }

    deleteButton.addEventListener('click', () => {
      deleteElem(todo.name)
    })

    checkbox.addEventListener('click', () => {
      isStatusTrue(todo.status, todo.name)
    })
  })
}

renderToDo(arrayOfToDo)
