const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("News API route.");
});

module.exports = router;
