if(process.env.NODE_ENV !== 'production'){
  //in dev
  require('dotenv').config()
}

//Bringing in express
const express = require('express')
//get the app variable from express 
const app = express();
//using bcrypt to hash our password
const bcrypt = require('bcrypt')
const passport = require('passport')

//flash messages for errors
const flash = require('express-flash')
const session = require('express-session')

const methodOverride = require('method-override')

//require passport.js function from config file
const initPassport = require('./passport-config')
initPassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//NO DATABASE: using local storage in file
const users = []

//tell our server we are using ejs
app.set('view-engine', 'ejs')
//telling our application to access our forms inside of our post method
app.use(express.urlencoded({extended: false}))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//setting up route
app.get('/', checkAuthUsers, (req, res) => {
  res.render('index.ejs', {name: req.user.name})
})

//GET routes for login 
app.get('/login', checkNotAuthUsers, (req, res) => {
  res.render('login.ejs')
})

//post route for login form 
app.post('/login', checkNotAuthUsers, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthUsers, (req, res) => {
  res.render('register.ejs')
})
//post route for register form 
app.post('/register', checkNotAuthUsers, async (req, res) => {
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

//logging out
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//make sure non-logged users cannot access data/are authenticated 
function checkAuthUsers(req, res, next){
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

//make usure logged in users don't go to login page 
function checkNotAuthUsers(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}

//app running on port 3000
app.listen(3000)