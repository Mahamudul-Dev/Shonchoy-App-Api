// db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool using .env variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Number of connections in the pool
})

const db = pool.promise();

module.exports = {pool, db}
