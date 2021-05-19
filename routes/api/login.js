const express = require('express');
const router = express.Router();
const hash = require('object-hash');
const short = require('short-uuid');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

router.get('/', (req, res) => {
  res.send("Login API route.");
});

router.post('/', (req, res) => {
  let email = req.body.user.email;
  let password = hash(req.body.user.password);

  // use [email] to prevent sql injection
  db.each("SELECT * FROM users WHERE email=?", [email], (error, account) => {
    if (error) throw error;

    if (password != account.password) {
      res.render("pages/login", {
        status: "failed"
      });
      return;
    }

    res.cookie("verify", password);
    res.redirect("/panel/home");
    return;
  })

  res.render("pages/login", {
    status: "failed"
  });

})

module.exports = router;
