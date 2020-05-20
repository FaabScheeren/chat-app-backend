const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New websocket connection.");
  socket.emit("message", "Welcome, to this connection!");

  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("formSubmit", (input, callback) => {
    const filter = new Filter();

    if (filter.isProfane(input)) {
      return callback("Profanity is not allowed!");
    }

    io.emit("updateMessage", input);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });

  socket.on("sendLocation", (location, callback) => {
    // console.log(location);
    io.emit(
      "message",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );

    callback("Location shared!");
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
