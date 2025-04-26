const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const port = 8080;
app.use(express.static(path.join(__dirname, "../public")));

const connectedBulbs = [];

io.on("connection", (socket) => {
  // save light info in socket object
  const lightID = socket.handshake.auth.lightID;
  const isOn = socket.handshake.auth.isOn;
  socket.data.lightID = lightID;
  socket.data.isOn = isOn;
  console.log(`Bulb ID from auth: ${socket.handshake.auth.lightID}`);
});

io.on("disconnect", (reason) => {
  console.log(reason);
});

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

app.post("/toggle-all", (req, res) => {
  console.log("All bulbs are toggled.");
  // send to all socket connections
  io.emit("toggle-all");
  res.sendStatus(200);
});

setInterval(() => {
  console.log("Currently connected sockets:");

  for (const [id, socket] of io.sockets.sockets) {
    console.log(
      `- Socket ID: ${id}, Light ID: ${socket.data.lightID}, isOn: ${socket.data.isOn}`
    );
  }

  console.log("-----");
}, 5000);
