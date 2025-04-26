const lightID = Math.random().toString(36).slice(2, 9).toUpperCase();
const lightIDString = document.querySelector(".lightID");
const statusString = document.querySelector(".statusString");
const bulb = document.querySelector(".bulb");
const button = document.querySelector("button");

let isOn = false;

const socket = io("ws://localhost:8080", {
  auth: {
    lightID: lightID,
    isOn: isOn,
  },
});

console.log("This light ID is: " + lightID); // example output: "k8l3jf9xq"

lightIDString.innerHTML = "Light ID: #" + lightID;

socket.on("connect", () => {
  console.log(`Connected to server as socket ${socket.id}`);
});

socket.on("toggle-all", () => {
  console.log("received toggle-all event.");
  toggleBulb();
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
}

function turnOffBulb() {
  isOn = false;
  bulb.classList.remove("bulb-on");
  statusString.innerHTML = "Light is OFF";
}

button.onclick = () => {
  toggleBulb();
};
