// Coordinates use board centre as origin; add 32.5 for lower-left coordinates.
const signals = ['ROW1','ROW2','ROW3','COL1','COL2','COL3']
export default () => <board width="65mm" height="65mm" layers={2}
  minTraceWidth="0.25mm" minTraceToPadEdgeClearance={0.25} minPadEdgeToPadEdgeClearance={0.25} minViaEdgeToPadEdgeClearance={0.25} minBoardEdgeClearance={0.25} minViaHoleEdgeToViaHoleEdgeClearance={0.25}
  autorouter={{preset:'auto_local',traceClearance:0.25}}>
  {signals.map(n=><net name={n} />)}
  <schematicsection name="Interface" displayName="Controller interface" />
  <pinheader name="J1" pinCount={6} pitch="2.54mm" gender="male" footprint="pinrow6_p2.54mm"
    schWidth={0.58} pinLabels={signals} showSilkscreenPinLabels pcbX={0} pcbY={28} schX={-6} schY={0} schSectionName="Interface" />
  <silkscreentext text="1 ROW1  ROW2  ROW3  COL1  COL2  COL3" pcbX={0} pcbY={31} fontSize={0.6} />
  {signals.map((n,i)=><trace from={`.J1 > .pin${i+1}`} to={`net.${n}`} thickness={0.25} />)}
  {[1,2,3].flatMap(r=>[1,2,3].map(c=>{
    const id=`${r}${c}`, x=12+(c-1)*20-32.5, y=12+(r-1)*20-32.5;
    const sx=(c-1)*8, sy=(r-1)*6;
    return <>
      <schematicsection name={`K${id}`} displayName={`Row ${r} Column ${c}`} />
      <pushbutton name={`SW${id}`} footprint="pushbutton" pcbX={x} pcbY={y}
        schX={sx} schY={sy} schSectionName={`K${id}`}
        internallyConnectedPins={[["pin1","pin2"],["pin3","pin4"]]} />
      <diode name={`D${id}`} manufacturerPartNumber="1N4148W" footprint="sod123"
        pinLabels={{pin1:'cathode',pin2:'anode'}} pcbX={x+6} pcbY={y}
        schX={sx+3} schY={sy} schSectionName={`K${id}`} />
      <silkscreentext text={`R${r}C${c}`} pcbX={x} pcbY={y-5} fontSize={1} />
      <silkscreentext text="K" pcbX={x+4.35} pcbY={y+1.7} fontSize={0.8} />
      <silkscreenline x1={x+4.8} y1={y-0.7} x2={x+4.8} y2={y+0.7} strokeWidth={0.15} />
      <net name={`KEY${id}`} />
      <trace from={`.SW${id} > .pin1`} to={`net.COL${c}`} thickness={0.25}/>
      <trace from={`.SW${id} > .pin2`} to={`net.COL${c}`} thickness={0.25}/>
      <trace from={`.SW${id} > .pin3`} to={`net.KEY${id}`} thickness={0.25}/>
      <trace from={`.SW${id} > .pin4`} to={`net.KEY${id}`} thickness={0.25}/>
      <trace from={`.D${id} > .anode`} to={`net.KEY${id}`} thickness={0.25}/>
      <trace from={`.D${id} > .cathode`} to={`net.ROW${r}`} thickness={0.25}/>
    </>
  }))}
</board>
