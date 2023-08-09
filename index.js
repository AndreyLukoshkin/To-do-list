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
// select
// MODAL WINDOW

// Save to LocalStorage

const saveLocalStorage = () => {
  return localStorage.setItem('array', JSON.stringify(arrayOfToDo))
}

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

  const calculatedTime = `${year}.${addZeroToDateMonth(month + 1, date)} 
  ${addZeroHoursSecondsMinutes(hh, mm, ss)}`
  return calculatedTime
}

// ARRAY OF TODOS

let arrayOfToDo = localStorage.getItem('array')
  ? JSON.parse(localStorage.getItem('array'))
  : []

let searchedArray

//CHECK FOR LINK

const linkRegex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/

// ADD NEW TASK

const addTask = () => {
  const randomId = Math.random()
  const id = Number(randomId.toFixed(15).substring(2))

  let splited = inputText.value.split(' ')
  let linkCorrect = []
  let correctText = []

  splited.forEach((el, i) => {
    if (linkRegex.test(el)) {
      return (linkCorrect = splited.filter((el) => linkRegex.test(el)))
    } else {
      return (correctText = splited.filter((el) => !linkRegex.test(el)))
    }
  })

  if (inputText.value) {
    inputText.classList.remove('container__inputTodo_inputText_wrong')
    arrayOfToDo.push({
      name: correctText.join(' '),
      link: linkCorrect.join(' '),
      status: false,
      time: getDateAndTime(),
      id: id,
    })

    saveLocalStorage()

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
  saveLocalStorage()
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

  saveLocalStorage()
  inputSearch.value = ''
  renderToDo(arrayOfToDo)
}

// CALLBACK - EDIT TASK

const editElem = (id, currentTodo, editBtn, parentContainer) => {
  let ind
  arrayOfToDo.forEach((el, i) => {
    if (id === el.id) ind = i
  })

  const containerWithEditAndDeleteButtons = parentContainer.querySelector(
    '.container__app_checkbox_delete'
  )

  const todoText = arrayOfToDo[ind].name
  const todoLink = arrayOfToDo[ind].link

  const inputEditElement = document.createElement('input')
  inputEditElement.classList.add('container__app_inputEdit')
  inputEditElement.value = todoText + ' ' + todoLink

  const cancelChangesEdit = document.createElement('button')
  cancelChangesEdit.textContent = 'cancel'
  cancelChangesEdit.id = 'cancelBtn'

  // if press cancel button

  const originalText = todoText
  const originalLink = todoLink

  cancelChangesEdit.addEventListener('click', () => {
    inputEditElement.remove()
    cancelChangesEdit.remove()
    editBtn.textContent = 'edit'
    editBtn.classList.remove('editing')
    arrayOfToDo[ind].name = originalText
    arrayOfToDo[ind].link = originalLink
    renderToDo(arrayOfToDo)
  })

  // if press edit button

  editBtn.classList.toggle('editing')

  if (editBtn.classList.contains('editing')) {
    currentTodo.append(inputEditElement)
    containerWithEditAndDeleteButtons.append(cancelChangesEdit)
    editBtn.textContent = 'save'

    inputEditElement.addEventListener('input', (event) => {
      const value = event.target.value

      let splited = value.split(' ')
      let linkCorrect = []
      let correctText = []

      splited.forEach((el, i) => {
        if (linkRegex.test(el)) {
          return (linkCorrect = splited.filter((el) => linkRegex.test(el)))
        } else {
          return (correctText = splited.filter((el) => !linkRegex.test(el)))
        }
      })
      arrayOfToDo[ind].name = correctText.join(' ')
      arrayOfToDo[ind].link = linkCorrect.join(' ')
    })
  } else {
    editBtn.textContent = 'edit'
    currentTodo.querySelector('input').remove()
    containerWithEditAndDeleteButtons.querySelector('#cancelBtn').remove()
  }

  // if press save button

  editBtn.addEventListener('click', () => {
    renderToDo(arrayOfToDo)
  })

  saveLocalStorage()
}

// CALLBACK - TOGGLE STATUS

const isStatusTrue = (id) => {
  let ind
  arrayOfToDo.forEach((el, i) => {
    if (id === el.id) ind = i
  })
  arrayOfToDo[ind].status = !arrayOfToDo[ind].status

  saveLocalStorage()
  inputSearch.value = ''
  renderToDo(arrayOfToDo)
}

// RENDER

const renderToDo = (arr) => {
  // console.log(arr)
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

  arr.forEach((todo) => {
    const divContainerTodo = document.createElement('div')
    divContainerTodo.classList.add('container__app_todo-container')
    const paragraphLinkTimeContainer = document.createElement('div')
    paragraphLinkTimeContainer.classList.add(
      'container__app_paragraph_link_time'
    )
    const divTodoParagraphLink = document.createElement('div')
    divTodoParagraphLink.classList.add('container__app_paragraph_link')
    const divTime = document.createElement('div')
    divTime.classList.add('container__app_time')

    const divCheckboxDelete = document.createElement('div')
    divCheckboxDelete.classList.add('container__app_checkbox_delete')
    const checkbox = document.createElement('input')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')
    editButton.id = 'editButton'

    deleteButton.textContent = 'delete'
    editButton.textContent = 'edit'
    divTime.textContent = todo.time

    checkbox.type = 'checkbox'
    checkbox.value = 'value'
    checkbox.checked = todo.status

    // check for empty links
    if (todo.link) {
      const link = todo.link.split(' ')
      link.forEach((el) =>
        divTodoParagraphLink.insertAdjacentHTML(
          'beforeend',
          `<a href='${el}' class='container__app_link' target = '_blank'>${el}</a>`
        )
      )
    }

    const paragraph = document.createElement('p')
    paragraph.classList.add('container__app_paragraph')
    paragraph.textContent = todo.name

    divTodoParagraphLink.prepend(paragraph)
    divContainerTodo.append(paragraphLinkTimeContainer)
    paragraphLinkTimeContainer.append(divTodoParagraphLink)
    paragraphLinkTimeContainer.append(divTime)
    divContainerTodo.append(divCheckboxDelete)
    divCheckboxDelete.append(checkbox)
    divCheckboxDelete.append(deleteButton)
    divCheckboxDelete.append(editButton)
    app.appendChild(divContainerTodo)

    // TOGGLE STYLES IF STATUS - TRUE / CHECKED

    if (todo.status) {
      paragraphLinkTimeContainer.classList.toggle(
        'container__app_paragraph_time_checked'
      )
    }

    // DELETE TASK

    deleteButton.addEventListener('click', () => {
      deleteElem(todo.id)
    })

    // EDIT TASK

    editButton.addEventListener('click', (e) => {
      const parentContainer = e.target.closest('.container__app_todo-container')
      const currentTodo = parentContainer.firstElementChild
      const editBtn = e.target
      editElem(todo.id, currentTodo, editBtn, parentContainer)
    })

    // SET STATUS FOR TASK

    checkbox.addEventListener('click', () => {
      isStatusTrue(todo.id)
    })
  })
}

renderToDo(arrayOfToDo)
