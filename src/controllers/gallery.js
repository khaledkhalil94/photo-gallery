const express = require('express')
const router = express.Router()
const {
  uploadDest,
  registerUpload,
  getPictures,
  delPicture,
  ratePicture,
  isFaved,
  removeFav
} = require('../models/gallery')
const { getUserById } = require('../models/user')
const fs = require('fs')

router.route('/upload')
.post(function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.')

  const sampleFile = req.files.sampleFile
  const { title, desc } = req.body

  if (!fs.existsSync(uploadDest)) fs.mkdirSync(uploadDest)

  sampleFile.mv(uploadDest+sampleFile.name, function(err) {
    if (err) return res.status(500).send(err)
    else {
      console.log('file uploaded')
      registerUpload(req.body.id, sampleFile.name, title, desc)
      .then((result) => { // Success
        res.json({status: 'OK', fileId: result.rows[0].id})
      })
      .catch(err => { //err
        res.json({status: 'NOT OK'})
        console.log(err)
      })
    }
  })
})

router.route('/delete')
.post(function(req, res) {
  const id = Number(req.body.id)
  delPicture(id)
  .then((result) => {
    const filename = result.rows[0].filename
    console.log(filename)
    fs.unlink(uploadDest + filename, () => res.json('OK'))
    })
  .catch(err => {
    console.log(err)
    res.sendStatus(401)
  })
})

router.route('/setRating')
.post(function(req, res) {
  const picId = Number(req.body.id)
  const userId = Number(req.body.userId)

  ratePicture(picId, userId, 1)
  .then((result) => {
    const insert = result.rows[0].id
    if(insert) res.json('OK')
    else {
      console.log(result)
      sendStatus(400)
    }
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.route('/removeRating')
.post(function(req, res) {
  const picId = Number(req.body.id)
  const userId = Number(req.body.userId)

  removeFav(picId, userId)
  .then((result) => {
    const insert = result.rows[0].id
    if(insert) res.json('OK')
    else {
      console.log(result)
      sendStatus(400)
    }
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.route('/picture/:id')
.get(function(req, res) {
  const id = Number(req.params.id)
  const selfId = Number(req.query.userId)
  if(!id || !selfId) {
    res.sendStatus(400)
    return
  }
  getPictures(id).then(picture => {
    isFaved(id, selfId).then(x => picture.isFaved = !!x)
    return getUserById(picture.user_id).then(user => {
      delete user.password
      return Promise.all([picture, user])
    })
  })
  .then(values => res.json({picture: values[0], user: values[1]}))
  .catch(err => console.log(err))
})

router.route('/getFeedData')
.get(function(req, res) {
  getPictures()
  .then(data => res.json(data))
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

router.route('/:username')
.get(function(req, res) {
  const username = req.params.username
  getPictures(username)
  .then(data => res.json(data))
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.route('/*')
.all(function(req, res){
  res.sendStatus(404)
})

module.exports = router