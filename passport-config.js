const LocalStrategy = require('passport-local').Strategy //declare our local strategy
const bcrypt = require('bcrypt') //needed for hashing

//JS file to include all passport related information
function init(passport, getUserByEmail, getUserById) {
  const authenticateUser =  async (email, password, done) => {
    const user = getUserByEmail(email)
    if(user == null) {
      return done(null, false, { message: 'No user with that email'}) //err message
    }

    try {
      //compare password to see if email connects to password or incorrect
      if(await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect'}) //err message
      }
    } catch (e) {
      return done(e)
    }
  }

  //serialization and de-serialization 
  passport.use(new LocalStrategy({ usernameField: 'email'}, 
  authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
    })
}

module.exports = init
