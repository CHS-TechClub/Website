const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
const { verify } = require("./../utils/verify.js");

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

router.get("/events", (req, res) => {
  let cookie = req.cookies.verify;

  verify(cookie, (verified) => {
    if (!verified[0]) {
      res.redirect("/login");
      return;
    }

    let account = verified[1];
    res.render("pages/panelEvents", {name: account.name, img: account.imgPath, email: account.email});

  })

})

router.get('/logout', (req, res) => {
  res.cookie("verify", "failed");
  res.redirect("/");
})

module.exports = router;
