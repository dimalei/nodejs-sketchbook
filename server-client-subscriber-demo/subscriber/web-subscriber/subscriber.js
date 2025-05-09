const bulbID = Math.random().toString(36).slice(2, 9).toUpperCase();
const bulbIDString = document.getElementById("id");
const statusString = document.getElementById("status");
const bulb = document.getElementById("bulb");
const button = document.getElementById("toggle");
const connection = document.getElementById("connection");

let isOn = false;
const ip = "86.119.47.104:80";

const socket = io("ws://" + ip + "/bulbs", {
  query: { type: "WebBulb", bulbID: bulbID, isOn: isOn },
});

console.log("This light ID is: " + bulbID); // example output: "k8l3jf9xq"

bulbIDString.innerHTML = "Light ID: #" + bulbID;

socket.on("connect", () => {
  console.log(`Connected to server as socket ${socket.id}`);
  connection.innerText = "connected";
});

socket.on("toggle-all", () => {
  console.log("received toggle-all event.");
  toggleBulb();
});

socket.on("on-all", () => {
  console.log("received on-all event.");
  turnOnBulb();
});

socket.on("off-all", () => {
  console.log("received off-all event.");
  turnOffBulb();
});

socket.on("disconnect", () => {
  console.log(`socket disconnected`);
  connection.innerText = "disconnected";
});

function toggleBulb() {
  if (isOn) {
    turnOffBulb();
  } else {
    turnOnBulb();
  }
}

function turnOnBulb() {
  isOn = true;
  bulb.classList.add("bulb-on");
  statusString.innerHTML = "Light is ON";
  socket.emit("turn-on");
}

function turnOffBulb() {
  isOn = false;
  bulb.classList.remove("bulb-on");
  statusString.innerHTML = "Light is OFF";
  socket.emit("turn-off");
}

button.onclick = () => {
  toggleBulb();
};
