const express = require('express');
const app = express();
const ejs = require('ejs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
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

app.listen(process.env.PORT || 8000, () => {
  console.log(`Tech Site is running on port ${process.env.PORT || 8000}!`);
});
