// index.js
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const {pool} = require('./config/dbConfig'); 
const bodyParser = require('body-parser');
const routes = require('./routes/appRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

pool.getConnection((err, connection) => {
  
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }

    console.log('Connected to the database!');
    connection.release();
  });

app.use('/api/v3', routes)

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});