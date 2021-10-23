if(process.env.NODE_ENV !== 'production'){
  //in dev use environment variables
  require('dotenv').config()
}

const express          = require('express');
const session          = require('express-session');
const hbs              = require('express-handlebars');
const passport         = require('passport');
const bcrypt           = require('bcrypt');
const flash             = require('express-flash');
const methodOverride   = require('method-override')
const app              = express();

//require passport.js function from config file
const initPassport = require('./passport-config')
initPassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//NO DATABASE: using local storage in file, switch to JSON file if needed
const users = [];

//Enable handlebars to tell our server we are using hbs
//tell our server we are using hbs
app.engine('hbs', hbs({ extname: '.hbs'}))
app.set('view engine', 'hbs')

//express dir name to connect other public files and css files
app.use(express.static(__dirname + '/public'))

//set up secret key with ENV variables
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  resave: false, 
  saveUninitialized: false
}))

//telling our application to take these from our email and password to access them inside of our request variable inside of the POST method
app.use(express.urlencoded({extended: false}))
app.use(flash());


//Init passport
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//setting up route
app.get('/', checkAuthUsers, (req, res) => {
  res.render('index', {name: req.user.name})
})

//GET routes for login 
app.get('/login', checkNotAuthUsers, (req, res) => {
  res.render('login')
})

//POST route for login
app.post('/login', checkNotAuthUsers, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//get route for register
app.get('/register', checkNotAuthUsers, (req, res) => {
  res.render('register')
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
  console.log(users) //users array 
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

//make sure logged in users don't go to login page 
function checkNotAuthUsers(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}


app.listen(5000, () => {
	console.log("Listening on port 5000");
});









