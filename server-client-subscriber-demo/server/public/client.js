import { createListItem } from "./createListItem.js";

const toggleAll = document.querySelector(".toggleAll");
const onAll = document.querySelector(".onAll");
const offAll = document.querySelector(".offAll");
const lightsList = document.getElementById("lightsList");

const superSectretAuthToken = "1234";

// initiatie socket
const socket = io("ws://localhost:8080", {
  auth: {
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
    const listItem = createListItem(
      element.lightID,
      () => {
        fetch("/api/toggle?lightID=" + element.lightID, { method: "POST" });
      },
      element.isOn ? "/icons/lightbulb-fill/" : "/icons/lightbulb/"
    );
    // const card = Object.assign(document.createElement("div"), {
    //   className: "card mb-4 box-shadow",
    // });
    // const cardBody = Object.assign(document.createElement("div"), {
    //   className: "card mb-4 box-shadow",
    // });

    // const title = document.createElement("p");
    // title.textContent = element.lightID;
    // cardBody.appendChild(title);
    // card.appendChild(cardBody);
    // // element.lightID;
    // // element.isOn ? "ON" : "OFF";
    // card.onclick = () => {
    //   fetch("/api/toggle?lightID=" + element.lightID, { method: "POST" });
    // };
    // // element.isOn ? "lightgreen" : "tomato";

    lightsList.appendChild(listItem);
  });
};
