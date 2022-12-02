// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/about', (req, res) => {
  const about = true
  res.render('about', {about})
})

app.get('/portfolio', (req, res) => {
  const portfolio = true
  res.render('portfolio', { portfolio })
})

app.get('/contact', (req, res) => {
  const contact = true
  res.render('contact', { contact })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})