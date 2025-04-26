const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const port = 8080;

io.on("connection", (socket) => {
  //   console.log(`A Bulb connected ${socket.id}`);
  // save light in socket object
  const lightID = socket.handshake.auth.lightID;
  socket.data.lightID = lightID;
  console.log(`Bulb ID from auth: ${socket.handshake.auth.lightID}`);
  debugger;
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
