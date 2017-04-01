const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const { getUserByUsername } = require('../models/user')

// const fields = {
//   usernameField: 'username',
//   passwordField: 'password'
// }


const str = (username, password, done) => {
  getUserByUsername(username)
  .then(user => {
    if(!user) {
      console.log('Username is incorrect')
      return done(null, false, {failureFlash: 'Username is incorrect'})
    }
    if(user.password !== password) {
      console.log('Password is incorrect')
      return done(null, false, {failureFlash: 'Password is incorrect'})
    }
    else done(null, user)
  })
  .catch( err => {
    console.log(err)
    return done(null, false, {failureFlash: 'Something went wrong.'})
  })
}

module.exports = function() {
  passport.use(new localStrategy(str))
}