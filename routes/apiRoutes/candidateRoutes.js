const express = require('express');
const router = express.Router(); 
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all candidates
router.get('/candidates', (req, res) => {
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

router.delete('/candidates/:id', (req, res) =>{
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

router.post('/candidates', ({ body }, res) => {
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

router.put('/candidates/:id', (req, res) => {
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

module.exports = router; 