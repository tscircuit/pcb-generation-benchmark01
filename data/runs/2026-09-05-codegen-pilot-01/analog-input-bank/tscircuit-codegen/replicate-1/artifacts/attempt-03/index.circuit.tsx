import React from 'react'
export default () => <board width="80mm" height="50mm" layers={2}
  minTraceWidth="0.25mm" nominalTraceWidth="0.25mm"
  autorouter={{local:true, traceClearance:0.25}}
  routingTolerances={{minTraceWidth:0.25,minTraceToPadEdgeClearance:0.25,minPadEdgeToPadEdgeClearance:0.25,minViaEdgeToPadEdgeClearance:0.25,minBoardEdgeClearance:0.25}}>
  <net name="GND" />
  {[-36,36].flatMap(x=>[-21,21].map(y=><React.Fragment key={`${x},${y}`}>
    <hole diameter="3.2mm" pcbX={x} pcbY={y}/>
  </React.Fragment>))}
  {[1,2,3,4,5,6].map((i)=>{
    const x=-28+(i-1)*11.2, cx=-6.35+(i-1)*2.54;
    const sx=((i-1)%2)*20, sy=-Math.floor((i-1)/2)*14;
    const section=`Channel${i}`, ra=`R${3*i-2}`, rb=`R${3*i-1}`, rc=`R${3*i}`;
    return <React.Fragment key={i}>
      <schematicsection name={section} displayName={`Channel ${i}: 5V input / 2:3 divider / RC filter`}/>
      <net name={`IN${i}`}/><net name={`DIV${i}`}/><net name={`OUT${i}`}/>
      <pinheader name={`J${i}`} pinCount={2} pitch="2.54mm" gender="male" showSilkscreenPinLabels pinLabels={[`IN${i}`,"GND"]} pcbX={x} pcbY={21} schX={sx-4} schY={sy-0.44} schSectionName={section}/>
      <resistor name={ra} resistance="10k" footprint="0805" pcbX={x} pcbY={13} schX={sx} schY={sy} schSectionName={section}/>
      <resistor name={rb} resistance="20k" footprint="0805" pcbX={x} pcbY={8} schX={sx+3} schY={sy-3} schRotation={90} schSectionName={section}/>
      <resistor name={rc} resistance="1k" footprint="0805" pcbX={x} pcbY={3} schX={sx+6} schY={sy} schSectionName={section}/>
      <capacitor name={`C${i}`} capacitance="100nF" footprint="0805" pcbX={cx} pcbY={-15} pcbRotation={90} schX={sx+9} schY={sy-3} schRotation={90} schSectionName={section}/>
      <testpoint name={`TP${i}`} footprintVariant="pad" padShape="circle" padDiameter="1.5mm" pcbX={cx} pcbY={-10} schX={sx+10} schY={sy} schSectionName={section}/>
      <silkscreentext text={`OUT${i}`} pcbX={cx} pcbY={-8} fontSize={0.6}/>
      <silkscreentext text={`J${i}:1 IN${i}`} pcbX={x} pcbY={24} fontSize={0.7}/>
      <trace from={`.J${i} > .pin1`} to={`net.IN${i}`}/><trace from={`.${ra} > .pin1`} to={`net.IN${i}`}/>
      <trace from={`.J${i} > .pin2`} to="net.GND"/>
      <trace from={`.${ra} > .pin2`} to={`net.DIV${i}`}/><trace from={`.${rb} > .pin1`} to={`net.DIV${i}`}/><trace from={`.${rc} > .pin1`} to={`net.DIV${i}`}/>
      <trace from={`.${rb} > .pin2`} to="net.GND"/>
      <trace from={`.${rc} > .pin2`} to={`net.OUT${i}`}/><trace from={`.C${i} > .pin1`} to={`net.OUT${i}`}/><trace from={`.TP${i} > .pin1`} to={`net.OUT${i}`}/>
      <trace from={`.C${i} > .pin2`} to="net.GND"/>
      <trace from={`.J7 > .pin${i}`} to={`net.OUT${i}`}/>
    </React.Fragment>
  })}
  <schematicsection name="Outputs"/>
  <pinheader name="J7" schWidth={0.58} pinCount={8} pitch="2.54mm" gender="male" showSilkscreenPinLabels pinLabels={["OUT1","OUT2","OUT3","OUT4","OUT5","OUT6","GND","GND"]} pcbX={0} pcbY={-21} schX={42} schY={-12} schSectionName="Outputs"/>
  <trace from=".J7 > .pin7" to="net.GND"/><trace from=".J7 > .pin8" to="net.GND"/>
  <testpoint name="TP7" footprintVariant="pad" padShape="circle" padDiameter="1.5mm" pcbX={13} pcbY={-15} schX={46} schY={-12} schSectionName="Outputs"/>
  <trace from=".TP7 > .pin1" to="net.GND"/>
  <silkscreentext text="GND" pcbX={13} pcbY={-13} fontSize={0.8}/>
  <silkscreentext text="J7 1:OUT1 2:OUT2 3:OUT3 4:OUT4 5:OUT5 6:OUT6 7/8:GND" pcbX={0} pcbY={-24} fontSize={0.65}/>
</board>
