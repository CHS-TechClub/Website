const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Staff API route.");
});

module.exports = router;
