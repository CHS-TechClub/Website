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

router.get('/ctech', (req, res) => {
  res.render("pages/cTech");
})

router.get('/players/:uuid?', (req, res) => {
  res.render("pages/player", {
    uuid: req.params.uuid
  });
})

router.get('/groups/:name?', (req, res) => {
  res.render("pages/group", {
    name: req.params.name
  });
})

router.get('/login', (req, res) => {
  res.render("pages/login");
})

module.exports = router;
