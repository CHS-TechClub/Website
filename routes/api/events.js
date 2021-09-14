const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
const { verify } = require("./../../utils/verify.js");
const multer = require("multer");
const short = require('short-uuid');
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

router.get('/', (req, res) => {
  events = [];
  db.each("SELECT * FROM events", (error, event) => {
    events.push(event);
  }, () => {
    res.send(events);
  })
});

router.post('/createEvent', upload.single('file'), (req, res) => {
  let cookie = req.cookies.verify;
  let name = req.body.event.name;
  let about = req.body.event.about;
  let content = req.body.event.content;
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

    db.run("INSERT INTO events (name, imgPath, about, hasContent, id) VALUES (?, ?, ?, ?, ?)", [name, filePath, about, content, short()], (error) => {
      if (error) throw error;

      res.redirect("/panel/events");
    })

  })

})
module.exports = router;
