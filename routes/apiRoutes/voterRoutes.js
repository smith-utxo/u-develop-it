const express = require('express');
const router = express.Router(); 
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all Voters in Alpha Order
router.get('/voters', (req, res) => {
  const sql = `SELECT * FROM voters ORDER BY last_name`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Get single voter
router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id = ?`;
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

router.post('/voter', ({body}, res) => {
  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES(?,?,?)`;
  const params = [body.first_name, body.last_name, body.email];

  db.query(sql, params, (err, result) => {
    if(err) {
      res.status(400) 
    }
  })
})

module.exports = router; 