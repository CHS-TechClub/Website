const express = require('express');
const app = express();
const http = require('http').Server(app);
const ejs = require('ejs');

//Socket stuff
const ioServer = require('socket.io')(http);

//db
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

function registerSocketServer() {
  ioServer.on('connection', (socket) => {
    console.log("[Socket] Bot connected!");

    socket.on('news', (message) => {
      console.log(message);
    })

    socket.on('disconnect', () => {
      console.log("[Socket] Bot disconnected!");
    })

  });
}

http.listen(process.env.PORT || 8000, () => {
  registerSocketServer();
  console.log(`Tech Site is running on port ${process.env.PORT || 8000}!`);
});
