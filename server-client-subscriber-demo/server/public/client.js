const toggleAll = document.querySelector(".toggleAll");
const onAll = document.querySelector(".onAll");
const offAll = document.querySelector(".offAll");
const lightsList = document.querySelector("#lightsList");

const superSectretAuthToken = "1234";

// initiatie socket
const socket = io("ws://localhost:8080", {
  query: {
    type: "ui",
    token: superSectretAuthToken,
  },
});

socket.on("connect", () => {
  refreshUI();
}),
  //refresh UI on event
  socket.on("refresh-ui", () => {
    refreshUI();
  });

toggleAll.onclick = () => {
  fetch("/api/toggle-all", { method: "POST" });
  console.log("toggling all");
};

onAll.onclick = () => {
  fetch("/api/on-all", { method: "POST" });
  console.log("turning all on");
};

offAll.onclick = () => {
  fetch("/api/off-all", { method: "POST" });
  console.log("turning all off");
};

const refreshUI = () => {
  let lights = [];
  fetch("/api/lights", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      lights = data.lights;
      createTable(lights);
      console.log("Fetched lights: ", lights);
    });
};

const createTable = (lights) => {
  lightsList.innerHTML = "";

  lights.forEach((element) => {
    const row = document.createElement("tr");

    const lightIDCell = document.createElement("td");
    lightIDCell.textContent = element.lightID;

    const toggleButton = document.createElement("button");
    toggleButton.textContent = element.isOn ? "ON" : "OFF";
    toggleButton.onclick = () => {
      fetch("/api/toggle?lightID=" + element.lightID, { method: "POST" });
    };
    toggleButton.style.backgroundColor = element.isOn ? "lightgreen" : "tomato";

    const statusCell = document.createElement("td");
    statusCell.appendChild(toggleButton);

    row.appendChild(lightIDCell);
    row.appendChild(statusCell);
    lightsList.appendChild(row);
  });
};
