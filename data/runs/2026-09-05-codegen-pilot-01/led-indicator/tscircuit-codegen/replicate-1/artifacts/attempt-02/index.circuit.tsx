export default () => (
  <board width="30mm" height="20mm" layers={2} minTraceWidth="0.3mm"
    minTraceToPadEdgeClearance="0.3mm" minPadEdgeToPadEdgeClearance="0.3mm">
    <pinheader name="J1" pinCount={2} pitch="2.54mm" gender="male"
      pinLabels={["V5", "GND"]} showSilkscreenPinLabels={true}
      pcbX={-11} pcbY={0} pcbRotation={90} schX={-4} schY={0} />
    <resistor name="R1" resistance="1k" footprint="0805" pcbX={0} pcbY={2} schX={0} schY={1} />
    <led name="D1" color="red" footprint="0805" pcbX={11} pcbY={0} schX={4} schY={1} />
    <trace name="SUPPLY" from="J1.pin1" to="R1.pin1" thickness="0.3mm" />
    <trace name="LED_ANODE" from="R1.pin2" to="D1.anode" thickness="0.3mm" />
    <trace name="GROUND" from="D1.cathode" to="J1.pin2" thickness="0.3mm" />
    <silkscreentext text="1 +5V / 2 GND" pcbX={-8} pcbY={-5} fontSize={0.8} />
    <silkscreentext text="K" pcbX={13} pcbY={-2} fontSize={0.8} />
    <silkscreentext text="5V POWER" pcbX={0} pcbY={7} fontSize={1} />
  </board>
)
