/** KiCad SVG controls; all edits affect visualization only. */
const svg = document.querySelector<SVGSVGElement>("svg")!;
const original = svg.getAttribute("viewBox")!.split(/\s+/).map(Number);
let box = [...original];
const viewport = document.querySelector<HTMLDivElement>(".viewport")!;
function draw() {
  svg.setAttribute("viewBox", box.join(" "));
  document.querySelector("#zoom-level")!.textContent =
    Math.round((original[2] / box[2]) * 100) + "%";
}
function zoom(f: number, anchor?: [number, number]) {
  const w = box[2] * f,
    h = box[3] * f;
  if (w < original[2] / 30 || w > original[2] * 5) return;
  const [ax, ay] = anchor ?? [box[0] + box[2] / 2, box[1] + box[3] / 2];
  box = [ax + (box[0] - ax) * f, ay + (box[1] - ay) * f, w, h];
  draw();
}
document.querySelector<HTMLButtonElement>("#plus")!.onclick = () => zoom(0.8);
document.querySelector<HTMLButtonElement>("#minus")!.onclick = () => zoom(1.25);
document.querySelector<HTMLButtonElement>("#reset")!.onclick = () => {
  box = [...original];
  draw();
};
document.querySelector<HTMLButtonElement>("#fullscreen")!.onclick = () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => {});
};
const layerRows = [...document.querySelectorAll<HTMLElement>(".layer-control")];
function setVisibility(row: HTMLElement, visible: boolean) {
  const check = row.querySelector<HTMLInputElement>("[type=checkbox]")!;
  check.checked = visible;
  document.getElementById(check.dataset.layer!)!.style.display = visible
    ? ""
    : "none";
}
for (const row of layerRows) {
  const check = row.querySelector<HTMLInputElement>("[type=checkbox]")!,
    range = row.querySelector<HTMLInputElement>("[type=range]")!,
    g = document.getElementById(check.dataset.layer!)!;
  check.onchange = () => setVisibility(row, check.checked);
  range.oninput = () => {
    g.setAttribute("opacity", String(Number(range.value) / 100));
    row.querySelector("output")!.textContent = range.value + "%";
  };
  row.querySelector<HTMLButtonElement>("[data-solo]")!.onclick = () =>
    layerRows.forEach((r) => setVisibility(r, r === row));
}
document.querySelector<HTMLButtonElement>("#show-all")!.onclick = () =>
  layerRows.forEach((r) => setVisibility(r, true));
document.querySelector<HTMLButtonElement>("#hide-all")!.onclick = () =>
  layerRows.forEach((r) => setVisibility(r, false));
document.querySelector<HTMLSelectElement>("#layer-preset")!.onchange = (e) => {
  const preset = (e.target as HTMLSelectElement).value;
  for (const row of layerRows) {
    const name = row.dataset.layerName!;
    setVisibility(
      row,
      preset === "all" ||
        (preset === "copper"
          ? name.endsWith(".Cu") || name === "Edge.Cuts"
          : name.startsWith(preset === "front" ? "F." : "B.") ||
            name === "Edge.Cuts"),
    );
  }
};
document.querySelector<HTMLButtonElement>("#layers-reset")!.onclick = () => {
  for (const row of layerRows) {
    setVisibility(row, true);
    const r = row.querySelector<HTMLInputElement>("[type=range]")!;
    r.value = "50";
    r.dispatchEvent(new Event("input"));
  }
  document.querySelector<HTMLSelectElement>("#layer-preset")!.value = "all";
};
let selected: SVGElement | null = null;
const originals = new Map<
  SVGElement,
  { opacity: string | null; display: string }
>();
const itemSlider = document.querySelector<HTMLInputElement>("#item-opacity")!,
  itemOutput = document.querySelector<HTMLOutputElement>("#item-value")!,
  hideItem = document.querySelector<HTMLButtonElement>("#hide-item")!;
function remember(el: SVGElement) {
  if (!originals.has(el))
    originals.set(el, {
      opacity: el.getAttribute("opacity"),
      display: el.style.display,
    });
}
function selectItem(target: Element) {
  const layer = target.closest<SVGGElement>("g[data-layer-name]");
  if (!layer || target === layer) return;
  const el = (target.closest(".stroked-text") ?? target) as SVGElement;
  if (
    ![
      "path",
      "circle",
      "rect",
      "line",
      "polygon",
      "polyline",
      "ellipse",
      "text",
      "g",
    ].includes(el.localName)
  )
    return;
  selected?.classList.remove("selected-item");
  selected = el;
  selected.classList.add("selected-item");
  itemSlider.disabled = false;
  hideItem.disabled = false;
  itemSlider.value = String(
    Math.round(Number(el.getAttribute("opacity") ?? 1) * 100),
  );
  itemOutput.textContent = itemSlider.value + "%";
  document.querySelector("#selected-item-name")!.textContent =
    `${layer.dataset.layerName} · ${el.classList.contains("stroked-text") ? "text" : el.localName}`;
  document.querySelector<HTMLDetailsElement>("#inspector")!.open = true;
}
itemSlider.oninput = () => {
  if (!selected) return;
  remember(selected);
  selected.setAttribute("opacity", String(Number(itemSlider.value) / 100));
  itemOutput.textContent = itemSlider.value + "%";
};
hideItem.onclick = () => {
  if (!selected) return;
  remember(selected);
  selected.style.display = "none";
};
document.querySelector<HTMLButtonElement>("#restore-items")!.onclick = () => {
  for (const [el, initial] of originals) {
    if (initial.opacity === null) el.removeAttribute("opacity");
    else el.setAttribute("opacity", initial.opacity);
    el.style.display = initial.display;
  }
  originals.clear();
  selected?.classList.remove("selected-item");
  selected = null;
  itemSlider.disabled = true;
  hideItem.disabled = true;
  itemSlider.value = "100";
  itemOutput.textContent = "100%";
  document.querySelector("#selected-item-name")!.textContent =
    "Click a drawing item on the PCB";
};
let drag: number[] | null = null;
viewport.onpointerdown = (e) => {
  if (e.button !== 0) return;
  drag = [e.clientX, e.clientY, ...box];
  viewport.setPointerCapture(e.pointerId);
};
viewport.onpointermove = (e) => {
  if (!drag) return;
  const scale = Math.min(
    viewport.clientWidth / drag[4],
    viewport.clientHeight / drag[5],
  );
  box = [
    drag[2] - (e.clientX - drag[0]) / scale,
    drag[3] - (e.clientY - drag[1]) / scale,
    drag[4],
    drag[5],
  ];
  draw();
};
viewport.onpointerup = (e) => {
  if (drag && Math.hypot(e.clientX - drag[0], e.clientY - drag[1]) < 4) {
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    if (hit) selectItem(hit);
  }
  drag = null;
};
viewport.onpointercancel = () => {
  drag = null;
};
viewport.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const matrix = svg.getScreenCTM();
    let anchor: [number, number] | undefined;
    if (matrix) {
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        matrix.inverse(),
      );
      anchor = [p.x, p.y];
    }
    zoom(Math.exp(Math.max(-0.3, Math.min(0.3, e.deltaY * 0.001))), anchor);
  },
  { passive: false },
);
viewport.ondblclick = () => {
  box = [...original];
  draw();
};
draw();
