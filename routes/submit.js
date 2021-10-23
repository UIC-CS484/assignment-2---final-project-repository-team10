var express = require('express');
var router = express.Router();
var fs = require('fs');
var bcrypt = require('bcrypt');


/* GET home page. */
router.post('/', async (req, res,) => {
  
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  var first_name = req.body.name;
  var email = req.body.email;
  var password = hashedPassword;

  
  if (password.length < 8){
      // var error = "Password not long enough";
      // res.render('error', {error:error});
      console.log('password not long enough')
      res.redirect('./register')
  }
  else{
      console.log("name: " + first_name + " Email: " + email + " Password: " + password);

      'use strict';
          var randomValue = Math.random() * 123;
      let users = [{ 
          id: randomValue,
          name: first_name, 
          email: email,
          password: password
      }];
      
      let data = JSON.stringify(users);
      fs.writeFileSync('users.json', data);

      res.redirect('/')

      // res.render('confirmation', { name : first_name});
  }

});

module.exports = router;