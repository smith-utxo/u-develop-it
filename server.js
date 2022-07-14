const express = require('express');

const PORT = process.env.PORT || 3001; 
const app = express(); 
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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

// Get all candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    //If there is no error than err is null and the response is sent back using the following statement. Not that the response is as a JSON object to the browser using res in the express.js route callback: 
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a candidate
app.delete('/api/candidates/:id', (req, res) =>{
  const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if(err){
      res.statusMessage(400).json({error: res.message});
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      })
    }else{
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      })
    }
  })

})

// Create a candidate
app.post('/api/candidates', ({ body }, res) => {
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];

db.query(sql, params, (err, result) => {
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.json({
    message: 'success',
    data: body
  });
});
});

// Update a candidate's party
app.put('/api/candidates/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');

if (errors) {
  res.status(400).json({ error: errors });
  return;
}
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});
// Create catchall route to handle user requests and aren't supported by the app. 
//SUPER IMPORTANT TO PLACE THIS BELOW THE app.get or it will override them and you will get the error for correct routes as well!

// Create a candidate
/* const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`; // Placeholders
const params = [1, 'Ronald', 'Firbank', 1]; // declared a variable for parameters for legibility for the call function to the database. ORDER HERE MUST MATCH WHAT'S IN PARENTHESIS ABOVE. ALSO MUST MATCH THE NUMBER OF ? PLACEHOLDERS

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
app.use((req, res) => {
  res.status(404).end();
}) */
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if(err) {
      res.status(500).json({error: err.message});
      return; 
    }
    res.json({
      message: 'success', 
      data: rows
    });
  });
});

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// listen to PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})