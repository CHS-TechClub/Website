const express = require('express');
const router = express.Router();

//routes
const newsRoute = require('./api/news');
const loginRoute = require('./api/login');
const staffRoute = require('./api/staff');
const eventsRoute = require('./api/events');

router.get('/', (req, res) => {
  res.send("API online!");
});

router.use('/news', newsRoute);
router.use('/login', loginRoute);
router.use('/staff', staffRoute);
router.use('/events', eventsRoute);

module.exports = router;
