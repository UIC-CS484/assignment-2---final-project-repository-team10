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

//routes
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login')
var submitRouter = require('./routes/submit')
var loginSubmitRouter = require('./routes/loginSubmit')
var indexRouter = require('./routes/index')

let users = require('./users.json')

//secret key for captcha
const secretKey = '6LcdbO0cAAAAAKNyyB-Tl8qsOiZUPrstma6ftDYB'

//require passport.js function from config file
const initPassport = require('./passport-config');
const router = require('./routes/register');
initPassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

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
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(flash());


//Init passport
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//routes
app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/submit', submitRouter);
app.use('/loginSubmit', loginSubmitRouter);
app.use('/index', indexRouter);

//logging out
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

//captcha
app.post('/verify', (req, res) => {
  if(!req.body.captcha){
    console.log("err");
    return res.json({"success":false, "msg":"Capctha is not checked"});
   
  }
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}';

  request(verifyUrl, (err, response, body) => {
    if(err){
      console.log(err);
    }
    body = JSON.parse(body);

    if(!body.success || body.score < 0.4){
      return res.join({'msg': 'you might be a robot, sorry', 'score':body.score});
    }

    return res.join({'msg': 'You have been verified', 'score':body.score});

  })
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
    return res.redirect('/index')
  }
  next()
}

router.use(checkAuthUsers);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, () => {
	console.log("Listening on port 5000");
});









