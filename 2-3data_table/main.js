// Target
// target input element
const input = document.getElementById('action__input__1')
// target dark mode toggle
const darkModeToggle = document.getElementById('dark__mode__toggle')
// target table
const table = document.querySelector('.table__body')
const tableHeader = document.querySelector('.table__header')


// Handler
// click handler
const toggleMenu = event => {
  const menu = document.getElementById('action__menu__1')
  menu.classList.toggle('hidden')
}

// dark mode toggle handler
const darkModeToggleHandler = event => {
  if (event.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

// select checkbox handler
const selectCheckbox = event => {
  const parent = event.target.closest('.table__row')
  parent.classList.toggle('checked')
}

// select all checkbox handler
const selectAllCheckbox = event => {
  const tableRow = document.querySelectorAll('.table__body .table__row')
  tableRow.forEach ((row) => {
    const checkbox = row.firstElementChild.firstElementChild
    // other checkbox checked or not
    if (event.target.checked) {
      checkbox.checked = true
    } else {
      checkbox.checked = false
    }
    // change table__row background
    row.classList.toggle('checked')
  })
}


// Bind the event
// hidden or show menu
input.addEventListener('click', toggleMenu)

// change dark mode
darkModeToggle.addEventListener('change', darkModeToggleHandler)

// select checkbox
table.addEventListener('change', selectCheckbox)

// select all checkbox
tableHeader.addEventListener('change', selectAllCheckbox)
