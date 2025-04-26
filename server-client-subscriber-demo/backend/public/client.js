const toggleAll = document.querySelector(".toggleAll");

toggleAll.onclick = () => {
  fetch("/toggle-all", { method: "POST" });
  console.log("toggling all");
};
