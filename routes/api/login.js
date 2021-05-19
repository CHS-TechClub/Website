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
    if (!file) {
      cb(null, "logo_light.jpg");
    } else {
      cb(null, file.originalname) //Appending .jpg
    }
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
  let userAccount = null;
  db.each("SELECT * FROM users WHERE password=? LIMIT 1", [cookie], (error, account) => {
    if (error) throw error;

    userAccount = account;

  }, () => {
    if (!userAccount) {
      callback([false]);
      return
    }
    callback([true, userAccount])
  })

}

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

    let filePath;
    if (!file) {
      filePath = "/images/logo_light.jpg"
    } else {
      filePath = "/images/" + file.originalname;
    }

    db.run("INSERT INTO users (email, imgPath, password, name) VALUES (?, ?, ?, ?)", [email, filePath, password, displayname], (error, result) => {
      if (error) throw error;

      res.redirect("/panel/staff");
    })

  })

})

router.post('/deleteuser', (req, res) => {
  let cookie = req.cookies.verify;
  let email = req.body.user.email;

  verify(cookie, (verified) => {
    if (!verified[0] || !verified) {
      res.redirect("/login");
      return;
    }

    console.log("verified");
    let password;
    db.each("SELECT * FROM users WHERE email=?", [email], (error, account) => {
      if (error) throw error;

      password = account.password;
      if (account.email == "dev@gmail.com") { //no deleting the dev account!
        res.redirect("/panel/staff");
        return;
      }
      fs.unlink("./public" + account.imgPath, (err) => {
        if (err) throw err;
      })

    }, () => {
      db.run("DELETE FROM users WHERE email=?", [email], (error) => {
        if (error) throw error;

        if (password == cookie) {
          res.redirect("/login");
        } else {
          res.redirect("/panel/staff");
        }

      })
    })


  })

})

module.exports = router;
