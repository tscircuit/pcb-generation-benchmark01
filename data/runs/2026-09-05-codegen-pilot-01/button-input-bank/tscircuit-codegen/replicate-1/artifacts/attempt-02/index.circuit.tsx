export default () => (
  <board width="50mm" height="35mm" layers={2} minTraceWidth="0.25mm" minTraceToPadEdgeClearance="0.25mm" minPadEdgeToPadEdgeClearance="0.25mm" minViaEdgeToPadEdgeClearance="0.25mm"
    autorouter={{local:true, traceClearance:0.25}}
    title="Four-button digital input board">
    <schematicsection name="Header" />
    <pinheader name="J1" pinCount={6} pitch="2.54mm" gender="male"
      footprint="pinrow6_p2.54mm" pcbX={0} pcbY={11}
      schX={-12} schY={0} schSectionName="Header"
      pinLabels={["V3V3", "GND", "BTN1", "BTN2", "BTN3", "BTN4"]}
      showSilkscreenPinLabels={true} />
    <net name="V3V3" /><net name="GND" />
    <trace from=".J1 > .pin1" to="net.V3V3" thickness="0.25mm" />
    <trace from=".J1 > .pin2" to="net.GND" thickness="0.25mm" />
    <silkscreentext text="1:+3V3  2:GND  3-6:BTN1-4" pcbX={0} pcbY={15} fontSize={0.8} />
    {[1,2,3,4].map((i) => {
      const x = -18 + (i-1)*12;
      const sx = (i-1)*8;
      return <>
        <schematicsection name={`Channel${i}`} displayName={`BTN${i}`} />
        <net name={`BTN${i}`} />
        <resistor name={`R${i}`} resistance="10k" footprint="0805"
          pcbX={x-2.5} pcbY={3} schX={sx} schY={3} schRotation={90} schSectionName={`Channel${i}`} />
        <capacitor name={`C${i}`} capacitance="100nF" footprint="0805"
          pcbX={x+2.5} pcbY={3} schX={sx+2} schY={-1} schRotation={90} schSectionName={`Channel${i}`} />
        <pushbutton name={`SW${i}`} footprint="pushbutton" internallyConnectedPins={[["pin1","pin2"],["pin3","pin4"]]}
          pcbX={x} pcbY={-7} schX={sx-2} schY={-1} schRotation={90} schSectionName={`Channel${i}`} />
        <silkscreentext text={`BTN${i}`} pcbX={x} pcbY={-13} fontSize={1.3} />
        <trace from={`.J1 > .pin${i+2}`} to={`net.BTN${i}`} thickness="0.25mm" />
        <trace from={`.R${i} > .pin1`} to="net.V3V3" thickness="0.25mm" />
        <trace from={`.R${i} > .pin2`} to={`net.BTN${i}`} thickness="0.25mm" />
        <trace from={`.C${i} > .pin1`} to={`net.BTN${i}`} thickness="0.25mm" />
        <trace from={`.C${i} > .pin2`} to="net.GND" thickness="0.25mm" />
        <trace from={`.SW${i} > .pin1`} to={`net.BTN${i}`} thickness="0.25mm" />
        <trace from={`.SW${i} > .pin2`} to={`net.BTN${i}`} thickness="0.25mm" />
        <trace from={`.SW${i} > .pin3`} to="net.GND" thickness="0.25mm" />
        <trace from={`.SW${i} > .pin4`} to="net.GND" thickness="0.25mm" />
      </>
    })}
  </board>
)
