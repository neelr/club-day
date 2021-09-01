var http = require("http");
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "files/index.html"));
});

app.get("/sketch.js", (req, res) => {
  res.sendFile(path.join(__dirname, "files/sketch.js"));
});
app.get("/sketch-server.js", (req, res) => {
  res.sendFile(path.join(__dirname, "files/sketch-server.js"));
});

app.get("/main_server", (req, res) => {
  res.sendFile(path.join(__dirname, "files/mainServer.html"));
});
var server = http.createServer(app);
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  socket.on("broadcast", function (data) {
    io.emit("movement", { id: socket.id, ...data });
  });
  socket.on("start", function (data) {
    io.emit("start", { id: socket.id, ...data });
  });
  socket.on("stop", function (data) {
    io.emit("stop", { id: socket.id, ...data });
  });
});
server.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on ${process.env.port || 3000}`)
);
