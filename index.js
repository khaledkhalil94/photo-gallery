const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const fileUpload = require('express-fileupload')
const port = process.env.port || 3000
app.use(fileUpload())

require('./src/passport')(app)
app.use('/controllers', require('./src/controllers/'))

app.use('/', express.static(__dirname + '/public'))
app.use('/*', express.static(__dirname + '/public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended' : true}))
app.use(cookieParser())
app.use(session({secret: 'secret'}))

app.listen(port, function(err) {
    console.log(`Server running on ${port}`)
})
