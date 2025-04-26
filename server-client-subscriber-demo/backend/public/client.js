const toggleAll = document.querySelector(".toggleAll");
const onAll = document.querySelector(".onAll");
const offAll = document.querySelector(".offAll");

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
