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

// frontent route
app.use(express.static(path.join(__dirname, "../public")));
const authToken = "1234";

io.on("connection", (socket) => {
  // save light info in socket object
  const query = socket.handshake.query;

  if (query.type === "bulb") {
    socket.data.type = query.type;
    socket.data.lightID = query.bulbID;
    socket.data.isOn = query.isOn === "true"; // since query params are strings
    io.emit("refresh-ui");
    console.log(`Bulb just connected with ID: ${socket.data.lightID}`);
  } else if (query.type === "ui") {
    socket.data.type = "UI";
    console.log(`A UI just connected.`);
  }

  socket.on("turn-on", () => {
    socket.data.isOn = true;
    console.log(`Bulb ${socket.data.lightID} just turned ON.`);
  });

  socket.on("turn-off", () => {
    socket.data.isOn = false;
    console.log(`Bulb ${socket.data.lightID} just turned OFF.`);
  });

  socket.on("disconnect", (reason) => {
    io.emit("refresh-ui");
    console.log(`Socket ${socket.data.lightID} disconnected: ${reason}`);
  });

  socket.onAny((event, ...args) => {
    io.emit("refresh-ui");
    console.log(`Received event '${event}' with args:`, args);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

app.post("/api/toggle-all", (req, res) => {
  console.log("All bulbs are toggled.");
  // send to all socket connections
  io.emit("toggle-all");
  res.sendStatus(200);
});

app.post("/api/toggle", (req, res) => {
  const toToggleID = req.query.lightID;
  console.log("toggling ", toToggleID);
  Array.from(io.sockets.sockets.values())
    .filter((socket) => socket.data.lightID === toToggleID)
    .forEach((socket) => {
      socket.emit("toggle-all");
    });
  res.sendStatus(200);
});

app.post("/api/on-all", (req, res) => {
  console.log("All bulbs are turned on.");
  // send to all socket connections
  io.emit("on-all");
  res.sendStatus(200);
});

app.post("/api/off-all", (req, res) => {
  console.log("All bulbs are turned off.");
  // send to all socket connections
  io.emit("off-all");
  res.sendStatus(200);
});

app.get("/api/lights", (req, res) => {
  let lights = [];
  io.sockets.sockets.forEach((socket) => {
    if (socket.data.type === "bulb") {
      lights.push({
        lightID: socket.data.lightID,
        isOn: socket.data.isOn,
      });
    }
  });
  res.send({ lights: lights });
});

setInterval(() => {
  // print all connected sockets evers 5 seconds
  console.log("Currently connected sockets:");
  for (const [id, socket] of io.sockets.sockets) {
    if (socket.data.type === "ui") {
      console.log(`- Socket ID: ${id}, User Interface`);
    } else {
      console.log(
        `- Socket ID: ${id}, Light ID: ${socket.data.lightID}, isOn: ${socket.data.isOn}`
      );
    }
  }

  console.log("-----");
}, 5000);
