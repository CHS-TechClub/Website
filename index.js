const express = require('express');
const app = express();
const http = require('http').Server(app);
const ejs = require('ejs');

//routing
const frontendRoute = require("./routes/frontend");
const apiRoute = require("./routes/api");
const panelRoute = require("./routes/panel");

//Socket stuff
const ioServer = require('socket.io')(http);

//db
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");
const cookieParser = require('cookie-parser');

app.enable('verbose errors');
require('events').EventEmitter.defaultMaxListeners = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', frontendRoute);
app.use('/api', apiRoute);
app.use('/panel', panelRoute);

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

function registerDatabase() {
  db.run("CREATE TABLE IF NOT EXISTS events (name VARCHAR, imgPath VARCHAR, about VARCHAR, hasContent BOOLEAN, id VARCHAR)", (error, result) => {
    if (error) throw error;
    console.log("Connected to Events Table!");
  })

  db.run("CREATE TABLE IF NOT EXISTS users (email VARCHAR, imgPath VARCHAR, password VARCHAR, name VARCHAR)", (error, result) => {
    if (error) throw error;
    console.log("Connected to Users Table!");
  })

}

http.listen(process.env.PORT || 8000, () => {
  registerSocketServer();
  registerDatabase();
  console.log(`Tech Site is running on port ${process.env.PORT || 8000}!`);
});
