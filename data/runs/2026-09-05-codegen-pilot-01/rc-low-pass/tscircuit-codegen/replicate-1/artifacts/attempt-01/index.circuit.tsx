export default () => (
  <board width="35mm" height="25mm" layers={2}
    minTraceWidth="0.25mm" nominalTraceWidth="0.25mm"
    autorouter={{ local: true, traceClearance: "0.25mm" }}
    routingTolerances={{ minTraceWidth: "0.25mm", minTraceToPadEdgeClearance: "0.25mm", minPadEdgeToPadEdgeClearance: "0.25mm", minBoardEdgeClearance: "0.25mm", minViaEdgeToPadEdgeClearance: "0.25mm" }}>
    <pinheader name="J1" pinCount={2} pitch="2.54mm" gender="male" footprint="pinrow2" pinLabels={["SIGNAL_IN", "GND"]} pcbX={-14} pcbY={0} pcbRotation={90} schX={-5} schY={0} schFacingDirection="right" />
    <pinheader name="J2" pinCount={2} pitch="2.54mm" gender="male" footprint="pinrow2" pinLabels={["SIGNAL_OUT", "GND"]} pcbX={14} pcbY={0} pcbRotation={90} schX={5} schY={0} schFacingDirection="left" />
    <resistor name="R1" resistance="1k" footprint="0805" pcbX={0} pcbY={1.27} schX={0} schY={1} />
    <capacitor name="C1" capacitance="100nF" footprint="0805" pcbX={10} pcbY={0} pcbRotation={90} schX={2.5} schY={-1} schRotation={90} />
    <net name="SIGNAL_IN" />
    <net name="SIGNAL_OUT" />
    <net name="GND" />
    <trace from=".J1 > .pin1" to=".R1 > .pin1" thickness="0.25mm" />
    <trace from=".R1 > .pin1" to="net.SIGNAL_IN" thickness="0.25mm" />
    <trace from=".R1 > .pin2" to=".J2 > .pin1" thickness="0.25mm" />
    <trace from=".C1 > .pin1" to=".R1 > .pin2" thickness="0.25mm" />
    <trace from=".R1 > .pin2" to="net.SIGNAL_OUT" thickness="0.25mm" />
    <trace from=".J1 > .pin2" to="net.GND" thickness="0.25mm" />
    <trace from=".J2 > .pin2" to="net.GND" thickness="0.25mm" />
    <trace from=".C1 > .pin2" to="net.GND" thickness="0.25mm" />
    <silkscreentext text="1 SIGNAL_IN" pcbX={-11} pcbY={4} fontSize="0.8mm" />
    <silkscreentext text="2 GND" pcbX={-13} pcbY={-4} fontSize="0.8mm" />
    <silkscreentext text="1 SIGNAL_OUT" pcbX={10} pcbY={4} fontSize="0.8mm" />
    <silkscreentext text="2 GND" pcbX={13} pcbY={-4} fontSize="0.8mm" />
    <silkscreentext text="RC LOW PASS / 1k + 100nF" pcbX={0} pcbY={9} fontSize="0.8mm" />
  </board>
)
