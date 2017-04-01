const pg = require('pg')
const {url} = require('../config/db')
const {now} = require('./index')

const getUserById = (id) => getUser(parseInt(id))
const getUserByUsername = (username) => getUser(username)

const getUser = (i) => {
  const field = typeof i === 'number' ? 'id' : 'username'
  const query = `SELECT * FROM users WHERE ${field} = '${i}';`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then (result => {
        client.release()
        const user = result.rows[0]
        if(user) resolve(user)
        else reject(404)
      })
      .catch( err => reject(err) )
    })
    .catch( err => reject(err) )
  })
}

const registerUser = (username, email, password) => {
  const inputsValidation = validateInputs(username, email, password)
  if(!inputsValidation) return

  const query = `INSERT INTO users (username, email, password, registered)
  VALUES ('${username}', '${email}', '${password}', '${now()}') RETURNING id;`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then(result => {
        client.release()
         resolve(result.rows[0])
      })
      .catch( err => {
        console.log(err)
        reject(err)
      })
    })
    .catch( err => reject(err) )
  })
}

const updateUser = (oldUsername, username, email) => {

  const inputsValidation = validateInputs(username, email)
  if(!inputsValidation) return

  const query = `UPDATE users SET username = '${username}', email = '${email}' WHERE username = '${oldUsername}';`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then (result => {
        client.release()
        resolve(result)
      })
      .catch( err => {
        reject(err)
      })
    })
    .catch( err => reject(err) )
  })
}

const validateInputs = () => { // TODO
  return true
}

module.exports = {
  registerUser,
  updateUser,
  getUserById,
  getUserByUsername
}