const express = require('express');
const router = express.Router();
const hash = require('object-hash');
const short = require('short-uuid');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
const { verify } = require("./../../utils/verify.js");

router.get('/', (req, res) => {
  res.send("Login API route.");
});

router.post('/', (req, res) => {
  let email = req.body.user.email;
  let password = hash(req.body.user.password);

  // use [email] to prevent sql injection
  let userAccount = null;
  db.each("SELECT * FROM users WHERE email=? LIMIT 1", [email], (error, account) => {
    if (error) throw error;

    userAccount = account;

  }, () => {

    if (userAccount == null) {
      res.cookie("verify", "failed");
      res.redirect("/login");
      return;
    }

    if (password == userAccount.password) {
      res.cookie("verify", password);
      res.redirect("/panel");
    } else {
      res.cookie("verify", "failed");
      res.redirect("/login");
    }
  })

})


module.exports = router;
