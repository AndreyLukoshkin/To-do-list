const inputText = document.getElementById('inputText')
const button = document.getElementById('button')
const buttonClearAll = document.getElementById('buttonClearAll')
const buttonClearChecked = document.getElementById('buttonClearChecked')
const app = document.getElementById('app')
const select = document.getElementById('select')
const inputSearch = document.getElementById('input__search')
const tasksDiv = document.getElementById('tasks')
const modal = document.getElementById('modal')
const modalwrapper = document.getElementById('modalwrapper')
const closeModalBtn = document.getElementById('closeModalBtn')
const yesModalBtn = document.getElementById('yesModalBtn')

// MODAL WINDOW

//open
buttonClearAll.addEventListener('click', () => {
  if (arrayOfToDo.length === 0) return
  modalwrapper.classList.toggle('modal-wrapper')
  modal.classList.toggle('modal-open')
  document.documentElement.style.overflow = 'hidden'
})

//close
modalwrapper.addEventListener('click', (e) => {
  if (e.target === modalwrapper || e.target === closeModalBtn) {
    modalwrapper.classList.toggle('modal-wrapper')
    modal.classList.toggle('modal-open')
    document.documentElement.style.overflow = 'auto'
  }
})

// delete all and clear localstorage
yesModalBtn.addEventListener('click', () => {
  inputSearch.value = ''
  arrayOfToDo.length = 0
  localStorage.clear()
  modalwrapper.classList.toggle('modal-wrapper')
  modal.classList.toggle('modal-open')
  document.documentElement.style.overflow = 'auto'
  renderToDo(arrayOfToDo)
})

// CALCULATE TIME/DATE

const addZeroHoursSecondsMinutes = (...args) => {
  const res = []
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
  const res = []
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
  const time = new Date()

  const hh = time.getHours()
  const mm = time.getMinutes()
  const ss = time.getSeconds()
  const year = time.getFullYear()
  const month = time.getMonth()
  const date = time.getDate()

  const calculatedTime = `${year}.${addZeroToDateMonth(
    month + 1,
    date
  )} ${addZeroHoursSecondsMinutes(hh, mm, ss)}`
  return calculatedTime
}

// ARRAY OF TODOS

let arrayOfToDo = localStorage.getItem('array')
  ? JSON.parse(localStorage.getItem('array'))
  : []

let searchedArray

// ADD NEW TASK

const addTask = () => {
  const randomId = Math.random()
  const id = Number(randomId.toFixed(15).substring(2))

  if (inputText.value) {
    inputText.classList.remove('container__inputTodo_inputText_wrong')
    arrayOfToDo.push({
      name: inputText.value,
      status: false,
      time: getDateAndTime(),
      id: id,
    })

    localStorage.setItem('array', JSON.stringify(arrayOfToDo))

    inputText.value = ''
  } else {
    inputText.classList.add('container__inputTodo_inputText_wrong')
  }

  renderToDo(arrayOfToDo)
}

button.addEventListener('click', () => {
  addTask()
})
inputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask()
})

// DELETE ALL SELECTED TASKS

buttonClearChecked.addEventListener('click', () => {
  inputSearch.value = ''
  arrayOfToDo = arrayOfToDo.filter((item) => !item.status)
  localStorage.setItem('array', JSON.stringify(arrayOfToDo))
  renderToDo(arrayOfToDo)
})

// SORT BY NAME / TIME / CHECKED

select.addEventListener('change', (e) => {
  if (e.target.value === 'name') {
    inputSearch.value = ''
    arrayOfToDo.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    )
  }
  if (e.target.value === 'time') {
    inputSearch.value = ''
    arrayOfToDo.sort((a, b) => (a.time > b.time ? 1 : -1))
  }
  if (e.target.value === 'done') {
    inputSearch.value = ''
    arrayOfToDo.sort((a, b) => (a.status < b.status ? 1 : -1))
  }
  renderToDo(arrayOfToDo)
})

// SEARCH BY INPUT VALUE - CONTROLLED JS INPUT

inputSearch.addEventListener('input', (e) => {
  const value = e.target.value
  searchedArray = arrayOfToDo.filter((el) =>
    el.name.toLowerCase().includes(value.toLowerCase())
  )
  renderToDo(searchedArray)
})

// CALLBACK - DELETE TASK

const deleteElem = (id) => {
  let ind
  arrayOfToDo.forEach((el, i) => {
    if (id === el.id) ind = i
  })
  arrayOfToDo.splice(ind, 1)

  localStorage.setItem('array', JSON.stringify(arrayOfToDo))
  inputSearch.value = ''
  renderToDo(arrayOfToDo)
}

// CALLBACK - TOGGLE STATUS

const isStatusTrue = (id) => {
  let ind
  arrayOfToDo.forEach((el, i) => {
    if (id === el.id) ind = i
  })
  arrayOfToDo[ind].status = !arrayOfToDo[ind].status

  localStorage.setItem('array', JSON.stringify(arrayOfToDo))
  inputSearch.value = ''
  renderToDo(arrayOfToDo)
}

// RENDER

let linkRegex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/

const renderToDo = (arr) => {
  console.log(arr)
  // clear app, then append items with changes
  app.innerHTML = ''

  // SHOW TASKS IS EMPTY

  const divEmpty = document.createElement('div')
  divEmpty.textContent = 'You have no tasks'
  divEmpty.classList.add('container__app_empty')
  tasksDiv.textContent = `Tasks: ${arr.length}`

  if (arr.length === 0) {
    app.appendChild(divEmpty)
  }

  arr.forEach((todo, index) => {
    const divContainerTodo = document.createElement('div')
    divContainerTodo.classList.add('container__app_todo-container')

    const divTodoParagraphAndTime = document.createElement('div')
    divTodoParagraphAndTime.classList.add('container__app_paragraph_time')
    const paragraph = document.createElement('p')
    paragraph.classList.add('container__app_paragraph')
    const divTime = document.createElement('div')
    divTime.classList.add('container__app_time')

    const divCheckboxDelete = document.createElement('div')
    divCheckboxDelete.classList.add('container__app_checkbox_delete')
    const checkbox = document.createElement('input')
    const deleteButton = document.createElement('button')

    deleteButton.textContent = 'delete'
    paragraph.textContent = todo.name
    divTime.textContent = todo.time

    divTodoParagraphAndTime.id = 'divIdTextandTime'

    checkbox.type = 'checkbox'
    checkbox.value = 'value'
    checkbox.checked = todo.status

    if (linkRegex.test(todo.name)) {
      const link = document.createElement('a')
      link.classList.add('container__app_link')
      link.href = todo.name
      link.target = '_blank'
      link.textContent = todo.name
      divTodoParagraphAndTime.append(link)
    } else {
      divTodoParagraphAndTime.append(paragraph)
      divTodoParagraphAndTime.append(divTime)
    }

    divContainerTodo.append(divTodoParagraphAndTime)
    divContainerTodo.append(divCheckboxDelete)
    divCheckboxDelete.append(checkbox)
    divCheckboxDelete.append(deleteButton)
    app.appendChild(divContainerTodo)

    // TOGGLE STYLES IF STATUS - TRUE / CHECKED

    const divParagraphTime = document.querySelectorAll('#divIdTextandTime')
    if (todo.status) {
      divParagraphTime[index].classList.toggle(
        'container__app_paragraph_time_checked'
      )
    }

    // DELETE TASK

    deleteButton.addEventListener('click', () => {
      deleteElem(todo.id)
    })

    // SET STATUS FOR TASK

    checkbox.addEventListener('click', () => {
      isStatusTrue(todo.id)
    })
  })
}

renderToDo(arrayOfToDo)
