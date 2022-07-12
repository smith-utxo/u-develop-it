const express = require('express');

const PORT = process.env.PORT || 3001; 
const app = express(); 
const mysql = require('mysql2');

// Express Middleware
// express.urlencoded function is a built-in middleware function Express. It parses incoming requests with urlencoded payloads. 
//Syntax: express.urlendcoded([options]);
// Parameters: extended, inflate, limit, verify etc. 
// return value: It returns an object 
//URL encoding is the practice of translating unprintable characters with special meaning within URL's to a representation that is unambivuous and unversally accepted by web browsers and servers. 
app.use(express.urlencoded({ extended: false})); // False means you cannot POST nested objects. True means you can
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: '577489tF$W87MMi',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})

db.query(`SELECT * FROM candidates`, (err, rows) => {
  console.log(rows);
})
// Create catchall route to handle user requests and aren't supported by the app. 
//SUPER IMPORTANT TO PLACE THIS BELOW THE app.get or it will override them and you will get the error for correct routes as well!
app.use((req, res) => {
  res.status(404).end();
})

// listen to PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})