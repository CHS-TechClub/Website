const express = require('express');
const app = express();
const http = require('http').Server(app);
const ejs = require('ejs');

//routing
const frontendRoute = require("./routes/frontend");

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

app.use('/', frontendRoute);

function registerSocketServer() {
  ioServer.on('connection', (socket) => {
    console.log("[Socket] New client connection!");

    socket.on('news', (data) => {
      socket.broadcast.emit('news_message', data);
    })

    socket.on('disconnect', () => {
      console.log("[Socket] Client disconnected!");
    })

  });
}

http.listen(process.env.PORT || 8000, () => {
  registerSocketServer();
  console.log(`Tech Site is running on port ${process.env.PORT || 8000}!`);
});
