const pg = require('pg')
const {url} = require('../config/db')
const {now} = require('./index')
const uploadDest = './public/static/img/' // Upload file destination

/**
* @return promise
*/
const registerUpload = (id, fileName, title, desc) => {
  const query = `INSERT INTO pictures (user_id, filename, title, description, created)
  VALUES ('${id}', '${fileName}', '${title}', '${desc}', ${now()}) RETURNING id;`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then (result => {
        client.release()
        resolve(result)
      }) // register success
      .catch(err => reject(err)) // there's an error
    })
    .catch(err => reject(err)) // there's an error
  })
}

/**
* @param if passing number (id) in the username param,
* it will search for and return a single item by that id
* @return promise
*/
const getPictures = (id) => {
  return new Promise((resolve, reject) => {
    let query, single

    if(!id) {  // get all items
      const selections = 'users.id AS uid, users.username, pictures.created, pictures.id AS pic_id, pictures.title, pictures.filename'
      query = `SELECT ${selections}, (SELECT count(*) from pics_rating WHERE picture_id = pictures.id) as fav_count FROM pictures
      INNER JOIN users ON pictures.user_id::integer = users.id ORDER BY created DESC;`

    } else if(typeof id === 'number') { // get item by id
      query = `SELECT pictures.*, (SELECT count(*) from pics_rating WHERE picture_id = pictures.id) as fav_count FROM pictures WHERE id = ${id}`
      single = true

    } else {  // get item by username
      query = `SELECT pictures.*, (SELECT count(*) from pics_rating WHERE picture_id = pictures.id) as fav_count FROM pictures WHERE user_id = ${id}`
    }

    pg.connect(url)
    .then(client => {
      client.query(query)
      .then(records => {
        client.release()
        const { rows } = records
        single ? resolve(rows[0]) : resolve(rows)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

const isFaved = (picId, userId) => {
  const query = `SELECT 1 FROM pics_rating WHERE picture_id = ${picId} AND user_id = ${userId}`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then(records => {
        client.release()
        const { rows } = records
        resolve(rows[0])
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

const removeFav = (picId, userId) => {
  const query = `DELETE FROM pics_rating WHERE picture_id = ${picId} AND user_id = ${userId} RETURNING id`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then(id => {
        client.release()
        resolve(id)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

const delPicture = (id) => {
  const query = `DELETE FROM pictures WHERE id = ${id} RETURNING filename;`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then(result => {
        client.release()
        resolve(result)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

const ratePicture = (picId, userId) => {
  const query = `INSERT INTO pics_rating (user_id, picture_id, date)
  VALUES ('${userId}', '${picId}', ${now()}) RETURNING id;`

  return new Promise((resolve, reject) => {
    pg.connect(url)
    .then(client => {
      client.query(query)
      .then (result => {
        client.release()
        resolve(result)
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

module.exports = {
  registerUpload,
  uploadDest,
  getPictures,
  delPicture,
  ratePicture,
  isFaved,
  removeFav
}