const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

function verify(cookie, callback) {
  if (!cookie) {
    callback([false]);
    return;
  }

  if (cookie.toLowerCase() == "failed") {
    callback([false]);
    return;
  }

  //final check to make sure the account exists
  db.each("SELECT * FROM users WHERE password=? LIMIT 1", [cookie], (error, account) => {
    if (error) throw error;

    if (account) callback([true, account])
    else callback([false])

  })

}

router.get("/", (req, res) => {
  let cookie = req.cookies.verify;

  verify(cookie, (verified) => {
    if (!verified[0]) {
      res.redirect("/login");
      return;
    }

    let account = verified[1];
    res.render("pages/panel", {name: account.name, img: account.imgPath, email: account.email});

  })

})

router.get("/staff", (req, res) => {
  let cookie = req.cookies.verify;

  verify(cookie, (verified) => {
    if (!verified[0]) {
      res.redirect("/login");
      return;
    }

    let account = verified[1];
    res.render("pages/staff", {name: account.name, img: account.imgPath, email: account.email});

  })

})

module.exports = router;
