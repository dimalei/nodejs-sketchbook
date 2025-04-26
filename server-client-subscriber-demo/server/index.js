const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const port = 8080;

const connectedBulbs = [];

io.on("connection", (socket) => {
  // save light info in socket object
  const lightID = socket.handshake.auth.lightID;
  const isOn = socket.handshake.auth.isOn;
  socket.data.lightID = lightID;
  socket.data.isOn = isOn;
  console.log(`Bulb ID from auth: ${socket.handshake.auth.lightID}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Controlling the bulbs!</h1>");
});

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
