const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

router.get('/', (req, res) => {
  events = [];
  db.each("SELECT * FROM events", (error, event) => {
    events.push(event);
  }, () => {
    res.send(events);
  })
});

router.get('/createEvent', (req, res) => {
  
})
module.exports = router;
