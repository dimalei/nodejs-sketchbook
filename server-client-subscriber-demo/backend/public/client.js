const toggleAll = document.querySelector(".toggleAll");
const onAll = document.querySelector(".onAll");
const offAll = document.querySelector(".offAll");

const superSectretAuthToken = "1234";

// initiatie socket
const socket = io("ws://localhost:8080", {
  auth: {
    token: superSectretAuthToken,
  },
});

toggleAll.onclick = () => {
  fetch("/toggle-all", { method: "POST" });
  console.log("toggling all");
};

onAll.onclick = () => {
  fetch("/on-all", { method: "POST" });
  console.log("turning all on");
};

offAll.onclick = () => {
  fetch("/off-all", { method: "POST" });
  console.log("turning all off");
};
