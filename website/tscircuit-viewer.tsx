import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PCBViewer } from "@tscircuit/pcb-viewer";
type Circuit = NonNullable<
  React.ComponentProps<typeof PCBViewer>["circuitJson"]
>;

type Layer = { name: string; opacity: number; visible: boolean };
/** The native renderer creates one .pcb-layer-* canvas per drawing layer.
 * These pinned-package class hooks only change presentation, never circuit data.
 */
function NativeViewer({ circuit }: { circuit: Circuit }) {
  const host = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(Math.max(420, window.innerHeight - 54));
  const [layers, setLayers] = useState<Layer[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const resize = () => setHeight(Math.max(420, window.innerHeight - 54));
    window.addEventListener("resize", resize);
    const discover = () => {
      const names = [
        ...new Set(
          [...host.current!.querySelectorAll("canvas")].flatMap((c) =>
            [...c.classList]
              .filter((s) => s.startsWith("pcb-layer-"))
              .map((s) => s.slice(10)),
          ),
        ),
      ].sort();
      setLayers((previous) =>
        names.length === previous.length &&
        names.every((n) => previous.some((l) => l.name === n))
          ? previous
          : names.map(
              (name) =>
                previous.find((l) => l.name === name) ?? {
                  name,
                  opacity: 50,
                  visible: true,
                },
            ),
      );
    };
    const observer = new MutationObserver(discover);
    observer.observe(host.current!, { childList: true, subtree: true });
    discover();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  const update = (name: string, changes: Partial<Layer>) =>
    setLayers((ls) =>
      ls.map((l) => (l.name === name ? { ...l, ...changes } : l)),
    );
  return (
    <>
      <header className="native-bar">
        <strong>tscircuit PCB viewer</strong>
        <button onClick={() => setOpen(!open)} aria-expanded={open}>
          Layers & opacity
        </button>
        <button
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else
              void document.documentElement.requestFullscreen().catch(() => {});
          }}
        >
          Fullscreen
        </button>
      </header>
      <style>
        {`#native-host canvas[class*="pcb-layer-"]{opacity:.5!important}` +
          layers
            .map(
              (l) =>
                `#native-host canvas.pcb-layer-${CSS.escape(l.name)}{opacity:${l.opacity / 100}!important;${l.visible ? "" : "visibility:hidden!important;"}}`,
            )
            .join("")}
      </style>
      <div ref={host} id="native-host">
        <PCBViewer
          circuitJson={circuit}
          height={height}
          allowEditing={false}
          focusOnHover={false}
          clickToInteractEnabled={false}
          initialState={{
            is_showing_silkscreen: true,
            is_showing_courtyards: true,
            is_showing_solder_mask: true,
            is_showing_copper_pours: true,
          }}
        />
      </div>
      {open && (
        <aside className="native-panel">
          <h2>Layers & opacity</h2>
          <p>
            50% by default. The native toolbar also controls layers,
            measurements and overlays.
          </p>
          <div className="actions">
            <button
              onClick={() =>
                setLayers((ls) => ls.map((l) => ({ ...l, visible: true })))
              }
            >
              Show all
            </button>
            <button
              onClick={() =>
                setLayers((ls) => ls.map((l) => ({ ...l, visible: false })))
              }
            >
              Hide all
            </button>
            <button
              onClick={() =>
                setLayers((ls) =>
                  ls.map((l) => ({ ...l, visible: true, opacity: 50 })),
                )
              }
            >
              Reset 50%
            </button>
          </div>
          {layers.map((l) => (
            <div className="layer-control" key={l.name}>
              <label>
                <input
                  type="checkbox"
                  checked={l.visible}
                  onChange={(e) =>
                    update(l.name, { visible: e.target.checked })
                  }
                />
                {l.name.replaceAll("_", " ")}
              </label>
              <div className="slider-row">
                <input
                  aria-label={`${l.name} opacity`}
                  type="range"
                  min="0"
                  max="100"
                  value={l.opacity}
                  onChange={(e) =>
                    update(l.name, { opacity: Number(e.target.value) })
                  }
                />
                <output>{l.opacity}%</output>
                <button
                  onClick={() =>
                    setLayers((ls) =>
                      ls.map((x) => ({ ...x, visible: x.name === l.name })),
                    )
                  }
                >
                  Solo
                </button>
              </div>
            </div>
          ))}
        </aside>
      )}
    </>
  );
}
class RenderBoundary extends React.Component<
  React.PropsWithChildren,
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p role="alert">
        The native PCB viewer could not render this recorded design. Reload to
        retry.
      </p>
    ) : (
      this.props.children
    );
  }
}
const root = createRoot(document.getElementById("app")!);
root.render(<p>Loading PCB…</p>);
const source = document.body.dataset.circuit!;
fetch(source)
  .then(async (response) => {
    if (!response.ok) throw Error(`Circuit data: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw Error("Expected Circuit JSON array");
    root.render(
      <RenderBoundary>
        <NativeViewer circuit={data} />
      </RenderBoundary>,
    );
  })
  .catch((error) =>
    root.render(
      <p role="alert">Could not load PCB data: {String(error.message)}</p>,
    ),
  );
