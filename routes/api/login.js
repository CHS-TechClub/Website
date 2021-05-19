const express = require('express');
const router = express.Router();
const hash = require('object-hash');
const short = require('short-uuid');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending .jpg
  }
})
const upload = multer({storage: storage});
const fs = require("fs");
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

router.get('/', (req, res) => {
  res.send("Login API route.");
});

router.post('/', (req, res) => {
  let email = req.body.user.email;
  let password = hash(req.body.user.password);

  // use [email] to prevent sql injection
  db.each("SELECT * FROM users WHERE email=?", [email], (error, account) => {
    if (error) throw error;

    if (password == account.password) {
      res.cookie("verify", password);
      res.redirect("/panel");
    } else {
      res.cookie("verify", "failed");
      res.redirect("/login");
    }

  })

})

router.post('/createuser', upload.single('file'), (req, res) => {
  let cookie = req.cookies.verify;
  let email = req.body.user.email;
  let password = hash(req.body.user.password);
  let displayname = req.body.user.name;
  let file = req.file;

  verify(cookie, (verified) => {
    if (!verified[0]) {
      res.redirect("/login");
      return;
    }

    db.run("INSERT INTO users (email, imgPath, password, name) VALUES (?, ?, ?, ?)", [email, "/images/" + file.originalname, password, displayname], (error, result) => {
      if (error) throw error;

      res.redirect("/panel/staff");
    })

  })

})

module.exports = router;
