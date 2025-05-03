const bulbID = Math.random().toString(36).slice(2, 9).toUpperCase();
const bulbIDString = document.querySelector(".lightID");
const statusString = document.querySelector(".statusString");
const bulb = document.querySelector(".bulb");
const button = document.querySelector("button");

let isOn = false;

const socket = io("ws://localhost:8080/bulbs", {
  query: { type: "WebBulb", bulbID: bulbID, isOn: isOn },
});

console.log("This light ID is: " + bulbID); // example output: "k8l3jf9xq"

bulbIDString.innerHTML = "Light ID: #" + bulbID;

socket.on("connect", () => {
  console.log(`Connected to server as socket ${socket.id}`);
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
