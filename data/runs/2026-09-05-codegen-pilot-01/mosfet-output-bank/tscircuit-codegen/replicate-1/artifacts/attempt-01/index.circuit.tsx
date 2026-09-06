// AO3400A SOT-23: pin 1 gate, pin 2 source, pin 3 drain.
// B5819W SOD-123: pin 1 cathode (band), pin 2 anode.
const channels = [1,2,3,4]
export default () => <board width="70mm" height="50mm" layers={2}
  minTraceWidth="0.5mm" nominalTraceWidth="0.5mm"
  minTraceToPadEdgeClearance="0.25mm" minPadEdgeToPadEdgeClearance="0.25mm"
  minViaEdgeToPadEdgeClearance="0.25mm" minBoardEdgeClearance="0.5mm"
  autorouter={{preset:"auto_local",traceClearance:0.25}}>
  <schematicsection name="Power" />
  <schematicsection name="Control" />
  <net name="V12" /><net name="GND" />
  <pinheader name="J1" pinCount={2} pitch="2.54mm" footprint="pinrow2_p2.54mm" pinLabels={["V12","GND"]} showSilkscreenPinLabels pcbX={-29} pcbY={18} schX={-18} schY={10} schSectionName="Power" />
  <capacitor name="C1" capacitance="10uF" maxVoltage="25V" footprint="0805" pcbX={-24} pcbY={19} schX={-14} schY={10} schRotation={90} schSectionName="Power" />
  <capacitor name="C2" capacitance="100nF" maxVoltage="25V" footprint="0805" pcbX={-24} pcbY={15} schX={-10} schY={10} schRotation={90} schSectionName="Power" />
  <pinheader name="J2" pinCount={5} pitch="2.54mm" footprint="pinrow5_p2.54mm" pinLabels={["GND","CTRL1","CTRL2","CTRL3","CTRL4"]} showSilkscreenPinLabels pcbX={-27} pcbY={-6} pcbRotation={90} schX={-18} schY={0} schSectionName="Control" />
  <trace from=".J1 .pin1" to="net.V12" /><trace from=".J1 .pin2" to="net.GND" />
  <trace from=".C1 .pin1" to="net.V12" /><trace from=".C1 .pin2" to="net.GND" />
  <trace from=".C2 .pin1" to="net.V12" /><trace from=".C2 .pin2" to="net.GND" />
  <trace from=".J2 .pin1" to="net.GND" />
  <silkscreentext text="J1 1:+12V 2:GND" pcbX={-24} pcbY={23} fontSize={1} />
  <silkscreentext text="J2 1:GND" pcbX={-28} pcbY={-15} fontSize={1} />
  {channels.map((i) => {const y=18-(i-1)*12;const sy=12-(i-1)*9;return <>
    <schematicsection name={`Channel${i}`} />
    <mosfet name={`Q${i}`} channelType="n" mosfetMode="enhancement" footprint="sot23" manufacturerPartNumber="AO3400A" pinLabels={{pin1:["gate"],pin2:["source"],pin3:["drain"]}} pcbX={17} pcbY={y} schX={2} schY={sy} schSectionName={`Channel${i}`} />
    <resistor name={`R${2*i-1}`} resistance="100" footprint="0805" pcbX={7} pcbY={y+2} schX={-3} schY={sy} schSectionName={`Channel${i}`} />
    <resistor name={`R${2*i}`} resistance="100k" footprint="0805" pcbX={12} pcbY={y-3} pcbRotation={90} schX={0} schY={sy-3} schRotation={90} schSectionName={`Channel${i}`} />
    <diode name={`D${i}`} footprint="sod123" manufacturerPartNumber="B5819W" pinLabels={{pin1:["cathode"],pin2:["anode"]}} pcbX={25} pcbY={y} schX={7} schY={sy+1} schRotation={90} schSectionName={`Channel${i}`} />
    <pinheader name={`J${i+2}`} pinCount={2} pitch="2.54mm" footprint="pinrow2_p2.54mm" pinLabels={["V12",`OUT${i}`]} showSilkscreenPinLabels pcbX={31} pcbY={y} pcbRotation={90} schX={11} schY={sy+1} schSectionName={`Channel${i}`} />
    <net name={`OUT${i}`} /><net name={`CTRL${i}`} /><net name={`GATE${i}`} />
    <trace from={`.J2 .pin${i+1}`} to={`net.CTRL${i}`} />
    <trace from={`.R${2*i-1} .pin1`} to={`net.CTRL${i}`} />
    <trace from={`.R${2*i-1} .pin2`} to={`net.GATE${i}`} />
    <trace from={`.Q${i} .pin1`} to={`net.GATE${i}`} />
    <trace from={`.R${2*i} .pin1`} to={`net.GATE${i}`} />
    <trace from={`.R${2*i} .pin2`} to="net.GND" />
    <trace from={`.Q${i} .pin2`} to="net.GND" />
    <trace from={`.Q${i} .pin3`} to={`net.OUT${i}`} />
    <trace from={`.D${i} .pin2`} to={`net.OUT${i}`} />
    <trace from={`.D${i} .pin1`} to="net.V12" />
    <trace from={`.J${i+2} .pin1`} to="net.V12" />
    <trace from={`.J${i+2} .pin2`} to={`net.OUT${i}`} />
    <silkscreentext text={`J${i+2} 1:+12V 2:OUT${i}`} pcbX={25} pcbY={y+4} fontSize={0.8} />
  </>})}
</board>
