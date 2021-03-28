const express = require('express');
const app = express();
const ejs = require('ejs');
//const cookieParser = require('cookie-parser');

app.enable('verbose errors');
require('events').EventEmitter.defaultMaxListeners = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//app.use(cookieParser());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
  res.render("pages/index");
})

app.listen(8000, () => {
  console.log("Tech Site is running on port 8000!");
});
