const express = require('express')
const router = express.Router({ mergeParams : true })
const passport = require('passport')
const { registerUser, getUserById, updateUser } = require('../models/user')

router.route('/login')
.post(function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      console.log(err)
      return next(err)
    }
    if (user) { // authenticated
      delete user.password
      req.login(req.body, () => res.json(user))
    }
    else return res.json({success: false})      // not authenticated
  })(req, res, next)
})

router.route('/autologin')
.post(function(req, res) {
  getUserById(Number(req.body.userId))
  .then(user => res.json(user))
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.route('/signup')
.post(function (req, res) {
  const { username, email, password } = req.body

  registerUser(username, email, password)
  .then((user) => {
    console.log("New user registered: '%s'", username)
    req.login(req.body, () => res.json({username, email, id: user.id}))
  })
  .catch( err => res.json({
      taken: err.code === '23505',
      username: username
    }))
})

router.route('/getUserDetails/:id')
.get(function(req, res) {
  const id = parseInt(req.params.id)
  if(!id) res.sendStatus(400)
  getUserById(id)
  .then(user => {
    delete user.password
    res.json(user)
  })
  .catch(err => {
    console.log(err)
    if(err === 404) res.sendStatus(404)
  })
})

router.route('/updateUserDetails')
.post(function(req, res) {
  const { oldUsername, username, email } = req.body
  updateUser(oldUsername, username, email)
  .then(result => {
    if(result.rowCount === 1) res.json('OK')
  })
  .catch(err => {
    console.log(err)
    res.json('err')
  })
})

router.route('/*')
.all(function(req, res){
  res.sendStatus(404)
})


module.exports = router