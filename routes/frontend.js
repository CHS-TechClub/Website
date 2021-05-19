const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render("pages/index");
});

router.get('/about', (req, res) => {
  res.render("pages/about");
});

router.get('/council', (req, res) => {
  res.render("pages/council");
});

router.get('/events', (req, res) => {
  res.render("pages/events");
})

router.get('/login', (req, res) => {
  res.render("pages/login");
})

module.exports = router;
