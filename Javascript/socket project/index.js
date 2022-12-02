const express = require("express");
const { Server } = require("socket.io");
const app = express();
// access the http protocol for socket io
const http = require("http");

const expressServer = http.createServer(app);
const io = new Server(expressServer); // create the socket server

io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Clientside/index.html");
});

expressServer.listen(3000, () => {
  console.log("Express Server started with port 3000");
});
