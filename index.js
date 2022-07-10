console.log('Hello')    
console.log(document);
const app = document.getElementById('app');
const button = document.getElementById('button')

const inputText = document.getElementById('inputText')


// app.style.border = '1px solid red'
const arrayOfToDo = [
    {
        name: 'gotoshop',
        status: false
    },
    {
        name: 'tothemoon',
        status: false
    },
    {
        name: 'gogojack',
        status: true
    }
]

const deleteElem = (name) => {
    let indexDel;
    arrayOfToDo.forEach((item, index) => {
        if (item.name === name) {
            indexDel = index
        }
    })
    arrayOfToDo.splice(indexDel, 1)
    renderToDo()
}


const renderToDo = () => {
    app.innerHTML = ''
arrayOfToDo.forEach((todo, index) => {
    const paragraph = document.createElement('p');
    const span = document.createElement('span')
    const deleteButton = document.createElement('button')
    deleteButton.addEventListener('click', () => {
        deleteElem(todo.name)
    })
    deleteButton.textContent = 'delete'
    
    paragraph.textContent = todo.name


    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.id = "id";
    checkbox.checked = todo.status

    
    span.append(paragraph)
    span.append(checkbox)
    span.append(deleteButton)
    app.appendChild(span)
    console.log(paragraph)
    
})
}

// console.log(button)
button.addEventListener('click', () => {
    console.log('click')
    arrayOfToDo.push({ name: inputText.value, status: false})
    renderToDo();
})

renderToDo();
console.log(app);