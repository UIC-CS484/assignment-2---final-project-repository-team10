//Bringing in express
const express = require('express')
//get the app variable from express 
const app = express();
//using bcrypt to hash our password
const bcrypt = require('bcrypt')

//NO DATABASE: using local storage in file
const users = []

//tell our server we are using ejs
app.set('view-engine', 'ejs')
//telling our application to access our forms inside of our post method
app.use(express.urlencoded({extended: false}))

//setting up route
app.get('/', (req, res) => {
  res.render('index.ejs', {name: 'Rahul'})
})

//GET routes for login 
app.get('/login', (req, res) => {
  res.render('login.ejs')
})

//post route for login form 
app.post('/login', (req, res) => {
  
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})
//post route for register form 
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

//app running on port 3000
app.listen(3000)