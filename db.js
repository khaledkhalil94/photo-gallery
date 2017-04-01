const pg = require('pg')
const { url } = require('./src/config/db')

const query = `CREATE TABLE pics_rating (
    id serial primary key,
    picture_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer DEFAULT 1,
    date character varying NOT NULL
);
ALTER SEQUENCE pics_rating_id_seq RESTART WITH 1;

CREATE TABLE pictures (
    id serial primary key,
    filename character varying(255) NOT NULL,
    created character varying(15) NOT NULL,
    title character varying NOT NULL,
    description text,
    user_id integer NOT NULL
);
ALTER SEQUENCE pictures_id_seq RESTART WITH 1;

CREATE TABLE users (
    id serial primary key,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    registered character varying(15) NOT NULL,
    email character varying(50)
);
ALTER SEQUENCE users_id_seq RESTART WITH 1;`

pg.connect(url)
.then(client => {
  client.query(query)
  .then (result => {
    client.release()
    console.log('DB Schema created')
    process.exit()
  })
  .catch(err => console.log(err))
})
.catch(err => console.log(err))