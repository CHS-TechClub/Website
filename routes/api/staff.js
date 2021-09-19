const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
const hash = require('object-hash');
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
const { verify } = require("./../../utils/verify.js");

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

    let password;
    db.each("SELECT * FROM users WHERE email=?", [email], (error, account) => {
      if (error) throw error;

      password = account.password;
      if (account.email == "dev@gmail.com") { //no deleting the dev account!
        res.redirect("/panel/staff");
        return;
      }

      if (!account.imgPath.includes("logo_")) {
        fs.unlink("./public" + account.imgPath, (err) => {
          if (err) throw err;
        })
      }

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
