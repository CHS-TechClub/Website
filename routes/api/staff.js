const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

router.get('/', (req, res) => {

  let users = [];
  db.each("SELECT * FROM users", (error, user) => {
    userData = {
      email: user.email,
      imgPath: user.imgPath,
      name: user.name
    }
    users.push(userData);
  }, () => {
    res.send(users);
  })


});

module.exports = router;
