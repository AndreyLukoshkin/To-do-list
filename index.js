const inputText = document.getElementById('inputText')
const button = document.getElementById('button')
const buttonClearAll = document.getElementById('buttonClearAll')
const buttonClearChecked = document.getElementById('buttonClearChecked')
const app = document.getElementById('app')
const select = document.getElementById('select')
const inputSearch = document.getElementById('input__search')

const addZeroHoursSecondsMinutes = (...args) => {
  let res = []
  args.forEach((el) => {
    if (String(el).length < 2) {
      res.push(0 + String(el))
    } else {
      res.push(el)
    }
  })
  return res.join(':')
}

const addZeroToDateMonth = (...args) => {
  let res = []
  args.forEach((el) => {
    if (String(el).length < 2) {
      res.push(0 + String(el))
    } else {
      res.push(el)
    }
  })
  return res.join('.')
}

const getDateAndTime = () => {
  let time = new Date()

  let hh = time.getHours()
  let mm = time.getMinutes()
  let ss = time.getSeconds()
  let year = time.getFullYear()
  let month = time.getMonth()
  let date = time.getDate()

  let calculatedTime = `${year}.${addZeroToDateMonth(
    month + 1,
    date
  )} ${addZeroHoursSecondsMinutes(hh, mm, ss)}`
  return calculatedTime
}

const arrayOfToDoList = [
  {
    name: 'Wait first',
    status: false,
    time: getDateAndTime(),
  },
  {
    name: 'Go then',
    status: false,
    time: getDateAndTime(),
  },
  {
    name: 'Arriva',
    status: false,
    time: getDateAndTime(),
  },
]

localStorage.setItem('array', JSON.stringify(arrayOfToDoList))
let savedArray = localStorage.getItem('array')
let arrayOfToDo

if (savedArray) {
  arrayOfToDo = JSON.parse(savedArray)
} else {
  arrayOfToDo = arrayOfToDoList
}

button.addEventListener('click', () => {
  // add new todo/wrong if emptys

  if (inputText.value) {
    inputText.classList.remove('container__inputTodo_inputText_wrong')
    arrayOfToDo.push({
      name: inputText.value,
      status: false,
      time: getDateAndTime(),
    })
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
  if (e.target.value === 'time') {
    arrayOfToDo.sort((a, b) =>
      a.time.toLowerCase() > b.time.toLowerCase() ? 1 : -1
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

// RENDER

const renderToDo = (arr) => {
  app.innerHTML = ''
  // clear app, then append items with changes

  arr.forEach((todo, index) => {
    const divContainerTodo = document.createElement('div')
    divContainerTodo.classList.add('container__app_todo-container')

    //

    const divTodoParagraphAndTime = document.createElement('div')
    divTodoParagraphAndTime.classList.add('container__app_paragraph_time')
    const paragraph = document.createElement('p')
    const divTime = document.createElement('div')
    divTime.classList.add('container__app_time')

    //

    const divCheckboxDelete = document.createElement('div')
    divCheckboxDelete.classList.add('container__app_checkbox_delete')
    const checkbox = document.createElement('input')
    const deleteButton = document.createElement('button')

    //

    deleteButton.textContent = 'delete'
    paragraph.textContent = todo.name
    paragraph.id = 'paragraph'
    divTime.textContent = todo.time
    divTodoParagraphAndTime.id = 'divIdTextandTime'

    checkbox.type = 'checkbox'
    checkbox.name = 'name'
    checkbox.value = 'value'
    checkbox.id = 'id'
    checkbox.checked = todo.status

    divContainerTodo.append(divTodoParagraphAndTime)
    divTodoParagraphAndTime.append(paragraph)
    divTodoParagraphAndTime.append(divTime)
    divContainerTodo.append(divCheckboxDelete)
    divCheckboxDelete.append(checkbox)
    divCheckboxDelete.append(deleteButton)
    app.appendChild(divContainerTodo)

    if (todo.status) {
      // change style if we toggle status on true
      let paragraph = document.querySelectorAll('#paragraph')
      for (const p of paragraph) {
        if (p.textContent === todo.name)
          p.closest('div').classList.toggle(
            'container__app_paragraph_time_checked'
          )
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
