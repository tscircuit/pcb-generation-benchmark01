// website/viewer-client.ts
var svg = document.querySelector("svg");
var original = svg.getAttribute("viewBox").split(/\s+/).map(Number);
var box = [...original];
var viewport = document.querySelector(".viewport");
function draw() {
  svg.setAttribute("viewBox", box.join(" "));
  document.querySelector("#zoom-level").textContent = Math.round(original[2] / box[2] * 100) + "%";
}
function zoom(f, anchor) {
  const w = box[2] * f, h = box[3] * f;
  if (w < original[2] / 30 || w > original[2] * 5)
    return;
  const [ax, ay] = anchor ?? [box[0] + box[2] / 2, box[1] + box[3] / 2];
  box = [ax + (box[0] - ax) * f, ay + (box[1] - ay) * f, w, h];
  draw();
}
document.querySelector("#plus").onclick = () => zoom(0.8);
document.querySelector("#minus").onclick = () => zoom(1.25);
document.querySelector("#reset").onclick = () => {
  box = [...original];
  draw();
};
document.querySelector("#fullscreen").onclick = () => {
  if (document.fullscreenElement)
    document.exitFullscreen();
  else
    document.documentElement.requestFullscreen().catch(() => {});
};
var layerRows = [...document.querySelectorAll(".layer-control")];
function setVisibility(row, visible) {
  const check = row.querySelector("[type=checkbox]");
  check.checked = visible;
  document.getElementById(check.dataset.layer).style.display = visible ? "" : "none";
}
for (const row of layerRows) {
  const check = row.querySelector("[type=checkbox]"), range = row.querySelector("[type=range]"), g = document.getElementById(check.dataset.layer);
  check.onchange = () => setVisibility(row, check.checked);
  range.oninput = () => {
    g.setAttribute("opacity", String(Number(range.value) / 100));
    row.querySelector("output").textContent = range.value + "%";
  };
  row.querySelector("[data-solo]").onclick = () => layerRows.forEach((r) => setVisibility(r, r === row));
}
document.querySelector("#show-all").onclick = () => layerRows.forEach((r) => setVisibility(r, true));
document.querySelector("#hide-all").onclick = () => layerRows.forEach((r) => setVisibility(r, false));
document.querySelector("#layer-preset").onchange = (e) => {
  const preset = e.target.value;
  for (const row of layerRows) {
    const name = row.dataset.layerName;
    setVisibility(row, preset === "all" || (preset === "copper" ? name.endsWith(".Cu") || name === "Edge.Cuts" : name.startsWith(preset === "front" ? "F." : "B.") || name === "Edge.Cuts"));
  }
};
document.querySelector("#layers-reset").onclick = () => {
  for (const row of layerRows) {
    setVisibility(row, true);
    const r = row.querySelector("[type=range]");
    r.value = "50";
    r.dispatchEvent(new Event("input"));
  }
  document.querySelector("#layer-preset").value = "all";
};
var selected = null;
var originals = new Map;
var itemSlider = document.querySelector("#item-opacity");
var itemOutput = document.querySelector("#item-value");
var hideItem = document.querySelector("#hide-item");
function remember(el) {
  if (!originals.has(el))
    originals.set(el, {
      opacity: el.getAttribute("opacity"),
      display: el.style.display
    });
}
function selectItem(target) {
  const layer = target.closest("g[data-layer-name]");
  if (!layer || target === layer)
    return;
  const el = target.closest(".stroked-text") ?? target;
  if (![
    "path",
    "circle",
    "rect",
    "line",
    "polygon",
    "polyline",
    "ellipse",
    "text",
    "g"
  ].includes(el.localName))
    return;
  selected?.classList.remove("selected-item");
  selected = el;
  selected.classList.add("selected-item");
  itemSlider.disabled = false;
  hideItem.disabled = false;
  itemSlider.value = String(Math.round(Number(el.getAttribute("opacity") ?? 1) * 100));
  itemOutput.textContent = itemSlider.value + "%";
  document.querySelector("#selected-item-name").textContent = `${layer.dataset.layerName} · ${el.classList.contains("stroked-text") ? "text" : el.localName}`;
  document.querySelector("#inspector").open = true;
}
itemSlider.oninput = () => {
  if (!selected)
    return;
  remember(selected);
  selected.setAttribute("opacity", String(Number(itemSlider.value) / 100));
  itemOutput.textContent = itemSlider.value + "%";
};
hideItem.onclick = () => {
  if (!selected)
    return;
  remember(selected);
  selected.style.display = "none";
};
document.querySelector("#restore-items").onclick = () => {
  for (const [el, initial] of originals) {
    if (initial.opacity === null)
      el.removeAttribute("opacity");
    else
      el.setAttribute("opacity", initial.opacity);
    el.style.display = initial.display;
  }
  originals.clear();
  selected?.classList.remove("selected-item");
  selected = null;
  itemSlider.disabled = true;
  hideItem.disabled = true;
  itemSlider.value = "100";
  itemOutput.textContent = "100%";
  document.querySelector("#selected-item-name").textContent = "Click a drawing item on the PCB";
};
var drag = null;
viewport.onpointerdown = (e) => {
  if (e.button !== 0)
    return;
  drag = [e.clientX, e.clientY, ...box];
  viewport.setPointerCapture(e.pointerId);
};
viewport.onpointermove = (e) => {
  if (!drag)
    return;
  const scale = Math.min(viewport.clientWidth / drag[4], viewport.clientHeight / drag[5]);
  box = [
    drag[2] - (e.clientX - drag[0]) / scale,
    drag[3] - (e.clientY - drag[1]) / scale,
    drag[4],
    drag[5]
  ];
  draw();
};
viewport.onpointerup = (e) => {
  if (drag && Math.hypot(e.clientX - drag[0], e.clientY - drag[1]) < 4) {
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    if (hit)
      selectItem(hit);
  }
  drag = null;
};
viewport.onpointercancel = () => {
  drag = null;
};
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  const matrix = svg.getScreenCTM();
  let anchor;
  if (matrix) {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    anchor = [p.x, p.y];
  }
  zoom(Math.exp(Math.max(-0.3, Math.min(0.3, e.deltaY * 0.001))), anchor);
}, { passive: false });
viewport.ondblclick = () => {
  box = [...original];
  draw();
};
draw();
