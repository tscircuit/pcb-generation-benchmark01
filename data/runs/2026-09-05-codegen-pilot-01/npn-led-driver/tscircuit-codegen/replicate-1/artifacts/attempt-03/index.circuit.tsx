export default () => <board width="45mm" height="30mm" layers={2} minTraceWidth="0.25mm" minTraceToPadEdgeClearance={0.25} minPadEdgeToPadEdgeClearance={0.25} minViaEdgeToPadEdgeClearance={0.25} minBoardEdgeClearance={0.25} autorouter={{preset:"auto_local",traceClearance:0.25}}>
  <schematicsection name="IO" title="Power and control" />
  <schematicsection name="CH1" title="Channel 1" />
  <schematicsection name="CH2" title="Channel 2" />
  <pinheader name="J1" pinCount={4} pitch="2.54mm" gender="male" footprint="pinrow4_p2.54mm" pinLabels={["V5","GND","CTRL1","CTRL2"]} showSilkscreenPinLabels pcbX={-16} pcbY={0} pcbRotation={90} schWidth={0.675} schX={-10} schY={-2.88} schSectionName="IO" />
  <capacitor name="C1" capacitance="100nF" footprint="0805" pcbX={-12} pcbY={0} pcbRotation={90} schX={-7} schY={-2} schRotation={90} schSectionName="IO" />
  <silkscreentext text="1 +5V" pcbX={-17} pcbY={-6} fontSize={0.8}/>
  <silkscreentext text="2 GND | 3 CTRL1 | 4 CTRL2" pcbX={0} pcbY={-12} fontSize={0.8}/>
  <silkscreentext text="TWO CHANNEL LED DRIVER" pcbX={0} pcbY={13} fontSize={1}/>
  {[1,2].map((i)=>{const x=i===1?-3:12;const s=i===1?0:9;return <>
    <chip name={`Q${i}`} manufacturerPartNumber="MMBT3904LT1G" footprint="sot23" pinLabels={{pin1:"B",pin2:"E",pin3:"C"}} schPinArrangement={{leftSide:{pins:["B"],direction:"top-to-bottom"},rightSide:{pins:["C","E"],direction:"top-to-bottom"}}} pcbX={x} pcbY={-2} schHeight={0.4} schX={s} schY={0} schSectionName={`CH${i}`}/>
    <led name={`D${i}`} color="red" footprint="0805" pcbX={x} pcbY={9} pcbRotation={90} schX={s+2} schY={3} schRotation={90} schSectionName={`CH${i}`}/>
    <resistor name={`R${i===1?1:4}`} resistance="1k" footprint="0805" pcbX={x-4} pcbY={9} pcbRotation={90} schX={s+2} schY={5} schRotation={90} schSectionName={`CH${i}`}/>
    <resistor name={`R${i===1?2:5}`} resistance="4.7k" footprint="0805" pcbX={x-5} pcbY={-3} schX={s-3} schY={0} schSectionName={`CH${i}`}/>
    <resistor name={`R${i===1?3:6}`} resistance="100k" footprint="0805" pcbX={x} pcbY={-7} schX={s+1.2} schY={-3} schRotation={90} schSectionName={`CH${i}`}/>
  </>})}
  {Object.entries({V5:["J1.pin1","C1.pin1","R1.pin1","R4.pin1"],GND:["J1.pin2","C1.pin2","Q1.E","Q2.E","R3.pin2","R6.pin2"],CTRL1:["J1.pin3","R2.pin1"],CTRL2:["J1.pin4","R5.pin1"],BASE1:["R2.pin2","R3.pin1","Q1.B"],BASE2:["R5.pin2","R6.pin1","Q2.B"],ANODE1:["R1.pin2","D1.anode"],ANODE2:["R4.pin2","D2.anode"],COLLECTOR1:["Q1.C","D1.cathode"],COLLECTOR2:["Q2.C","D2.cathode"]}).flatMap(([net,pins])=>pins.map(pin=><trace key={pin} from={pin} to={`net.${net}`} thickness="0.25mm"/>))}
</board>
