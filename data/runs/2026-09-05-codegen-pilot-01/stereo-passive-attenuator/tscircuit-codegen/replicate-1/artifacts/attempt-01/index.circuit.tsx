export default () => (
  <board width="50mm" height="30mm" layers={2} minTraceWidth="0.25mm" autorouter={{preset:"auto_local",traceClearance:"0.25mm"}} routingTolerances={{minTraceWidth:"0.25mm",minTraceToPadEdgeClearance:"0.25mm",minPadEdgeToPadEdgeClearance:"0.25mm",minViaEdgeToPadEdgeClearance:"0.25mm"}}>
    <schematicsection name="Left" displayName="Left channel" />
    <schematicsection name="Right" displayName="Right channel" />
    <pinheader name="J1" pinCount={3} pitch="2.54mm" gender="male" pcbX={-22} pcbY={0} pcbRotation={90} schX={-7} schY={0} pinLabels={["LEFT_IN","GND","RIGHT_IN"]} showSilkscreenPinLabels />
    <pinheader name="J2" pinCount={3} pitch="2.54mm" gender="male" pcbX={22} pcbY={0} pcbRotation={90} schX={7} schY={0} pinLabels={["LEFT_OUT","GND","RIGHT_OUT"]} showSilkscreenPinLabels />
    <capacitor name="C1" capacitance="1uF" footprint="0805" pcbX={-12} pcbY={8} schX={-3} schY={4} schSectionName="Left" />
    <resistor name="R1" resistance="10k" footprint="0805" pcbX={0} pcbY={8} schX={0} schY={4} schSectionName="Left" />
    <resistor name="R2" resistance="10k" footprint="0805" pcbX={10} pcbY={5} pcbRotation={90} schX={3} schY={2.5} schRotation={90} schSectionName="Left" />
    <capacitor name="C2" capacitance="1uF" footprint="0805" pcbX={-12} pcbY={-8} schX={-3} schY={-4} schSectionName="Right" />
    <resistor name="R3" resistance="10k" footprint="0805" pcbX={0} pcbY={-8} schX={0} schY={-4} schSectionName="Right" />
    <resistor name="R4" resistance="10k" footprint="0805" pcbX={10} pcbY={-5} pcbRotation={90} schX={3} schY={-5.5} schRotation={90} schSectionName="Right" />
    <testpoint name="TP1" footprintVariant="pad" padShape="circle" padDiameter="1.5mm" pcbX={15} pcbY={10} schX={4} schY={4} />
    <testpoint name="TP2" footprintVariant="pad" padShape="circle" padDiameter="1.5mm" pcbX={15} pcbY={-10} schX={4} schY={-4} />
    <testpoint name="TP3" footprintVariant="pad" padShape="circle" padDiameter="1.5mm" pcbX={0} pcbY={0} schX={0} schY={0} />
    {[
      ["LEFT_IN",["J1.pin1","C1.pin1"]],
      ["LEFT_AC",["C1.pin2","R1.pin1"]],
      ["LEFT_OUT",["R1.pin2","R2.pin1","J2.pin1","TP1.pin1"]],
      ["RIGHT_IN",["J1.pin3","C2.pin1"]],
      ["RIGHT_AC",["C2.pin2","R3.pin1"]],
      ["RIGHT_OUT",["R3.pin2","R4.pin1","J2.pin3","TP2.pin1"]],
      ["GND",["J1.pin2","J2.pin2","R2.pin2","R4.pin2","TP3.pin1"]]
    ].map(([name,pins]) => <net name={name as string} connectsTo={pins as string[]} />)}
    <silkscreentext text="STEREO AC ATTENUATOR" pcbX={0} pcbY={13} fontSize={1} />
    <silkscreentext text="J1 PIN 1" pcbX={-19} pcbY={6} fontSize={0.8} />
    <silkscreentext text="J2 PIN 1" pcbX={19} pcbY={6} fontSize={0.8} />
    <silkscreentext text="LEFT_OUT" pcbX={15} pcbY={12} fontSize={0.8} />
    <silkscreentext text="RIGHT_OUT" pcbX={15} pcbY={-12} fontSize={0.8} />
    <silkscreentext text="GND" pcbX={0} pcbY={2} fontSize={0.8} />
  </board>
)
