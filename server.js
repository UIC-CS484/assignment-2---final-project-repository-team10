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

//app running on port 3000
app.listen(3000)