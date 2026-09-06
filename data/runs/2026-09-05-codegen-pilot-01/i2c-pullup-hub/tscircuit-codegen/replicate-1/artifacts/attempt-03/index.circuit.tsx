const signals = ["V3V3", "GND", "SDA", "SCL"]
export default () => (
  <board width="45mm" height="35mm" layers={2} minTraceWidth="0.25mm" nominalTraceWidth="0.25mm"
    autorouter={{local:true, traceClearance:"0.25mm"}}
    routingTolerances={{minTraceWidth:"0.25mm",minTraceToPadEdgeClearance:"0.25mm",minPadEdgeToPadEdgeClearance:"0.25mm",minViaEdgeToPadEdgeClearance:"0.25mm",minBoardEdgeClearance:"0.25mm"}}>
    <schematicsection name="IO" displayName="I2C connectors and local bypass" />
    <schematicsection name="PU" displayName="Optional pull-ups (jumpers normally open)" />
    {signals.map(name=><net name={name} />)}
    {[{n:1,x:-19,y:0,r:90,sx:-8,sy:5},{n:2,x:19,y:0,r:90,sx:0,sy:5},{n:3,x:0,y:14,r:0,sx:8,sy:5}].map(({n,x,y,r,sx,sy})=><>
      <pinheader name={`J${n}`} pinCount={4} pitch="2.54mm" gender="male" footprint="pinrow4_p2.54mm" pcbX={x} pcbY={y} pcbRotation={r}
        schX={sx} schY={sy} schWidth={0.58} schSectionName="IO" pinLabels={["V3V3","GND","SDA","SCL"]} showSilkscreenPinLabels />
      <capacitor name={`C${n}`} capacitance="100nF" footprint="0805" pcbX={n===1?-15:n===2?15:0} pcbY={n===3?10:0} pcbRotation={90} schX={sx} schY={sy-4} schRotation={90} schSectionName="IO" />
      {signals.map((net,i)=><trace from={`.J${n} > .pin${i+1}`} to={`net.${net}`} thickness="0.25mm" />)}
      <trace from={`.C${n} > .pin1`} to="net.V3V3" thickness="0.25mm" />
      <trace from={`.C${n} > .pin2`} to="net.GND" thickness="0.25mm" />
    </>)}
    {[{n:1,y:3,s:"SDA"},{n:2,y:-3,s:"SCL"}].map(({n,y,s})=><>
      <resistor name={`R${n}`} resistance="4.7k" footprint="0805" pcbX={-4} pcbY={y} schX={-2} schY={-4-n*3} schSectionName="PU" />
      <solderjumper name={`JP${n}`} footprint="solderjumper2_p1.8mm_pw1.5mm_ph1.5mm" bridged={false} pcbX={2} pcbY={y} schX={2} schY={-4-n*3} schSectionName="PU" />
      <trace from={`.R${n} > .pin1`} to="net.V3V3" thickness="0.25mm" />
      <trace from={`.R${n} > .pin2`} to={`.JP${n} > .pin1`} thickness="0.25mm" />
      <trace from={`.JP${n} > .pin2`} to={`net.${s}`} thickness="0.25mm" />
      <silkscreentext text={`${s} PU`} pcbX={2} pcbY={y-2} fontSize="1mm" />
    </>)}
    <silkscreentext text="PIN 1 = +3V3" pcbX={0} pcbY={-15} fontSize="1mm" />
    <silkscreentext text="I2C HUB 3V3" pcbX={0} pcbY={-13} fontSize="1.3mm" />
    <silkscreentext text="1" pcbX={-20.8} pcbY={-4} fontSize="1mm" />
    <silkscreentext text="1" pcbX={17.2} pcbY={-4} fontSize="1mm" />
    <silkscreentext text="1" pcbX={-5.5} pcbY={14} fontSize="1mm" />
  </board>
)
