const dbUser = 'apptest'   // database user/login role
const dbName = 'apptest'   // database name
const dbPw   = '123456'    // database password
const dbPort = '5432'      // database port

module.exports.url = `postgres://${dbUser}:${dbPw}@localhost:${dbPort}/${dbName}`