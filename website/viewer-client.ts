/** Standalone PCB viewer controls, bundled by Bun for the browser. */
const svg = document.querySelector<SVGSVGElement>("svg")!;
const original = svg.getAttribute("viewBox")!.split(/\s+/).map(Number);
let box = [...original];
function draw() {
  svg.setAttribute("viewBox", box.join(" "));
}
function zoom(f: number) {
  const w = box[2] * f,
    h = box[3] * f;
  if (w < original[2] / 30 || w > original[2] * 5) return;
  box = [box[0] + (box[2] - w) / 2, box[1] + (box[3] - h) / 2, w, h];
  draw();
}
document.querySelector<HTMLButtonElement>("#plus")!.onclick = () => zoom(0.8);
document.querySelector<HTMLButtonElement>("#minus")!.onclick = () => zoom(1.25);
document.querySelector<HTMLButtonElement>("#reset")!.onclick = () => {
  box = [...original];
  draw();
};
for (const label of document.querySelectorAll<HTMLLabelElement>("label")) {
  const check = label.querySelector<HTMLInputElement>("[type=checkbox]")!,
    range = label.querySelector<HTMLInputElement>("[type=range]")!,
    g = document.getElementById(check.dataset.layer!)!;
  check.onchange = () => {
    g.style.display = check.checked ? "" : "none";
  };
  range.oninput = () => {
    g.setAttribute("opacity", String(Number(range.value) / 100));
    label.querySelector("output")!.textContent = range.value + "%";
  };
}
document.querySelector<HTMLButtonElement>("#layers-reset")!.onclick = () => {
  for (const l of document.querySelectorAll("label")) {
    const c = l.querySelector<HTMLInputElement>("[type=checkbox]")!,
      r = l.querySelector<HTMLInputElement>("[type=range]")!;
    c.checked = true;
    c.dispatchEvent(new Event("change"));
    r.value = "50";
    r.dispatchEvent(new Event("input"));
  }
};
let drag: number[] | null = null;
const viewport = document.querySelector<HTMLDivElement>(".viewport")!;
viewport.onpointerdown = (e) => {
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
viewport.onpointerup = viewport.onpointercancel = () => {
  drag = null;
};
