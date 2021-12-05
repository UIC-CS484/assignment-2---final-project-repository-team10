var express = require('express');
var router = express.Router();

// router.use(checkNotAuthUsers)

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('login')
  
})


module.exports = router;