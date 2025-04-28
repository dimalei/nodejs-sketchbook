export function createListItem(name, onClick, iconClass) {
  const li = document.createElement("li");
  li.className = "col mb-4";
  li.dataset.name = name;
  li.onClick = onClick;

  const divIcon = document.createElement("div");
  divIcon.className = "px-3 py-4 mb-2 bg-body-secondary text-center rounded";

  const icon = document.createElement("i");
  icon.className = iconClass;

  divIcon.appendChild(icon);

  const divName = document.createElement("div");
  divName.className = "name text-muted text-decoration-none text-center pt-1";
  divName.textContent = name;

  li.appendChild(divIcon);
  li.appendChild(divName);

  return li;
}
