const ID = Math.random().toString(36).slice(2, 9).toUpperCase();
const lightID = document.querySelector(".lightID");
const statusString = document.querySelector(".statusString");
const bulb = document.querySelector(".bulb");
const button = document.querySelector("button");

let isOn = false;

const socket = io("ws://localhost:8080", {
  auth: {
    ID: {
      state: isOn,
    },
  },
});

console.log("This lgiht ID is: " + ID); // example output: "k8l3jf9xq"

lightID.innerHTML = "Light ID: #" + ID;

socket.on("toggle", (text) => {
  const element = document.createElement("li");
  element.innerHTML = text;
  document.querySelector("ul").appendChild(element);
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
