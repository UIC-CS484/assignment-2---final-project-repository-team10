//Bringing in express
const express = require('express')
//get the app variable from express 
const app = express();

//tell our server we are using ejs
app.set('view-engine', 'ejs')

//setting up route
app.get('/', (req, res) => {
  res.render('index.ejs', {name: 'Rahul'})
})

//GET routes for login and register
app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})
//post route for register form 
app.post('/register', (req, res) => {
  
})

//app running on port 3000
app.listen(3000)