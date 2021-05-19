const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

router.get("/", (req, res) => {
  let cookie = req.cookies.verify;
  if (cookie) {
    if (cookie.toLowerCase() == "failed") {
      res.redirect("/login");
      return;
    }

    //final check to make sure the account exists
    db.each("SELECT * FROM users WHERE password=?", [cookie], (error, account) => {
      if (error) throw error;

      if (account) res.render("pages/panel", {name: account.name, img: account.imgPath, email: account.email});
      else res.redirect("pages/login");

    })

  } else {
    res.redirect("/login");
  }
})

module.exports = router;
