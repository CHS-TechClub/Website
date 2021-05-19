const express = require('express');
const router = express.Router();
const { verify } = require("./../../utils/verify.js");

router.get('/', (req, res) => {
  res.send("News API route.");
});

module.exports = router;
