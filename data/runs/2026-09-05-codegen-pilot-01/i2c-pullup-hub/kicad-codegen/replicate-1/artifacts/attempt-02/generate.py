import pcbnew as p, os, re, uuid, json, math, heapq, time, shutil
from pathlib import Path
OUT=Path(__file__).parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
uid=lambda:str(uuid.uuid4())
def sextract(txt,start):
 i=txt.index(start);depth=0;quoted=False;esc=False
 for j in range(i,len(txt)):
  c=txt[j]
  if c=='"' and not esc:quoted=not quoted
  if not quoted:
   if c=='(':depth+=1
   elif c==')':
    depth-=1
    if depth==0:return txt[i:j+1]
  esc=(c=='\\' and not esc)

spec=[]
def component(ref,val,lib,foot,pos,rot,nets,sch):spec.append(dict(ref=ref,val=val,lib=lib,foot=foot,pos=pos,rot=rot,nets=nets,sch=sch,uuid=uid()))
H='Connector_PinHeader_2.54mm:PinHeader_1x04_P2.54mm_Vertical'
R='Resistor_SMD:R_0805_2012Metric'; C='Capacitor_SMD:C_0805_2012Metric';J='Jumper:SolderJumper-2_P1.3mm_Open_Pad1.0x1.5mm'
for n,pos,rot in [(1,(3,14),0),(2,(42,14),0),(3,(18.69,3),90)]:component('J'+str(n),'I2C','Connector_Generic:Conn_01x04',H,pos,rot,['+3V3','GND','SDA','SCL'],(40+n*40,45))
for n,pos in [(1,(6.8,17.8)),(2,(38.2,17.8)),(3,(22.5,6.8))]:component('C'+str(n),'100nF','Device:C',C,pos,90,['+3V3','GND'],(40+n*40,80))
for n,y,net in [(1,17,'SDA'),(2,23,'SCL')]:
 component('R'+str(n),'4.7k','Device:R',R,(18,y),0,['+3V3','PU_'+net],(70,105+n*25))
 component('JP'+str(n),net+' PU','Jumper:SolderJumper_2_Open',J,(24,y),0,['PU_'+net,net],(110,105+n*25))
# Embed standard symbols, with labels wired to every native pin.
root=uid(); defs={}
for s in spec:
 lib,name=s['lib'].split(':')
 if s['lib'] not in defs:defs[s['lib']]=sextract((LIB/'symbols'/f'{lib}.kicad_sym').read_text(),f'(symbol "{name}"')
parts=[f'(kicad_sch (version 20250114) (generator "pcb-benchmark-codegen") (uuid "{root}") (paper "A4") (lib_symbols']
for k,v in defs.items():parts.append(v.replace('(symbol "'+k.split(':')[1]+'"','(symbol "'+k+'"',1))
parts.append(')')
for s in spec:
 x,y=[round(v/1.27)*1.27 for v in s['sch']];parts.append(f'(symbol (lib_id "{s["lib"]}") (at {x} {y} 0) (unit 1) (in_bom {"no" if s["ref"].startswith("JP") else "yes"}) (on_board yes) (dnp no) (uuid "{s["uuid"]}")')
 for key,val,py in [('Reference',s['ref'],y-8),('Value',s['val'],y-6),('Footprint',s['foot'],y)]:parts.append(f'(property "{key}" "{val}" (at {x+3} {py} 0) (effects (font (size 1.27 1.27))'+(' (hide yes)' if key=='Footprint' else '')+'))')
 parts.append(f'(instances (project "hub" (path "/{root}" (reference "{s["ref"]}") (unit 1)))) )')
 for m in re.finditer(r'\(pin (?:passive|input|output|bidirectional|power_in|power_out|unspecified) ',defs[s['lib']]):
  pin=sextract(defs[s['lib']][m.start():],'(pin ');a=re.search(r'\(at ([\d.\-]+) ([\d.\-]+) ([\d.\-]+)\)',pin);num=re.search(r'\(number "(\d+)"',pin).group(1)
  px,py,ang=map(float,a.groups());px+=x;py=y-py;ang=math.radians(ang);ex=px-5.08*math.cos(ang);ey=py+5.08*math.sin(ang);net=s['nets'][int(num)-1]
  parts.append(f'(wire (pts (xy {px:.4f} {py:.4f}) (xy {ex:.4f} {ey:.4f})) (stroke (width 0) (type default)) (uuid "{uid()}"))')
  parts.append(f'(label "{net}" (at {ex:.4f} {ey:.4f} 0) (effects (font (size 1 1)) (justify left bottom)) (uuid "{uid()}"))')
parts.append(')');(OUT/'hub.kicad_sch').write_text('\n'.join(parts))
# Board uses standard native footprints.
b=p.BOARD(); b.SetCopperLayerCount(2)
names=['+3V3','GND','SDA','SCL','PU_SDA','PU_SCL'];nets={}
for n in names:nets[n]=p.NETINFO_ITEM(b,'/'+n);b.Add(nets[n])
def pt(x,y):return p.VECTOR2I(round(x*1e6),round(y*1e6))
# Copper geometry retained for clearance-aware maze routing.
copper=[];pads={n:[] for n in names}
for s in spec:
 lib,fp=s['foot'].split(':');f=p.FootprintLoad(str(LIB/'footprints'/f'{lib}.pretty'),fp);f.SetFPIDAsString(s['foot']);f.SetReference(s['ref']);f.SetValue(s['val']);f.SetPosition(pt(*s['pos']));f.SetOrientationDegrees(s['rot']);f.SetPath(p.KIID_PATH('/'+root+'/'+s['uuid']))
 f.Reference().SetTextSize(pt(.8,.8));f.Reference().SetTextThickness(p.FromMM(.12));f.Reference().SetPosition(pt(s['pos'][0],s['pos'][1]-2.3));f.Value().SetVisible(False);b.Add(f)
 if s['ref']=='J3':f.Reference().SetPosition(pt(30,3))
 if s['ref']=='C3':f.Reference().SetPosition(pt(25.5,6.8))
 if s['ref']=='JP1':f.Reference().SetPosition(pt(27,17))
 for pad in f.Pads():
  n=s['nets'][int(pad.GetNumber())-1];pad.SetNet(nets[n]);x,y=pad.GetPosition().x/1e6,pad.GetPosition().y/1e6;w,h=pad.GetSize().x/1e6,pad.GetSize().y/1e6
  if s['rot']%180:w,h=h,w
  layers=[0,1] if pad.GetAttribute()==p.PAD_ATTRIB_PTH else [0]
  pads[n].append((x,y,layers));copper.append(('rect',n,layers,(x-w/2,y-h/2,x+w/2,y+h/2)))
for a,z in [((0,0),(45,0)),((45,0),(45,35)),((45,35),(0,35)),((0,35),(0,0))]:
 e=p.PCB_SHAPE();e.SetShape(p.SHAPE_T_SEGMENT);e.SetStart(pt(*a));e.SetEnd(pt(*z));e.SetLayer(p.Edge_Cuts);e.SetWidth(p.FromMM(.05));b.Add(e)
def text(txt,x,y,size=.8):
 t=p.PCB_TEXT(b);t.SetText(txt);t.SetPosition(pt(x,y));t.SetTextSize(pt(size,size));t.SetTextThickness(p.FromMM(.12));t.SetLayer(p.F_SilkS);b.Add(t)
text('I2C PULL-UP HUB',22.5,31,1.2);text('JP1 SDA PU',24,14);text('JP2 SCL PU',24,26)
for i,txt in enumerate(['1 +3V3','2 GND','3 SDA','4 SCL']):text(txt,10,14+i*2.54);text(txt,34.5,14+i*2.54)
for i,txt in enumerate(['1 3V3','2 GND','3 SDA','4 SCL']):text(txt,17+i*4,1.1,.8)
STEP=.2;NX=226;NY=176

def block(net,extra):
 blocked=[set(),set()]
 for shape,n,layers,g in copper:
  if n==net:continue
  if shape=='rect':x1,y1,x2,y2=g;rad=extra
  else:x1,y1,x2,y2,r=g;rad=r+extra
  xa=max(0,int(math.floor((min(x1,x2)-rad)/STEP)));xb=min(NX-1,int(math.ceil((max(x1,x2)+rad)/STEP)));ya=max(0,int(math.floor((min(y1,y2)-rad)/STEP)));yb=min(NY-1,int(math.ceil((max(y1,y2)+rad)/STEP)))
  for ix in range(xa,xb+1):
   for iy in range(ya,yb+1):
    x,y=ix*STEP,iy*STEP
    if shape=='rect':d=math.hypot(max(x1-x,0,x-x2),max(y1-y,0,y-y2))
    else:
     dx=x2-x1;dy=y2-y1;t=max(0,min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy))) if dx or dy else 0;d=math.hypot(x-x1-t*dx,y-y1-t*dy)
    if d<rad-1e-8:
     for l in layers:blocked[l].add((ix,iy))
 return blocked

def track(a,z,layer,net):
 if a==z:return
 t=p.PCB_TRACK(b);t.SetStart(pt(*a));t.SetEnd(pt(*z));t.SetWidth(p.FromMM(.25));t.SetLayer(p.F_Cu if layer==0 else p.B_Cu);t.SetNet(nets[net]);b.Add(t);copper.append(('seg',net,[layer],(*a,*z,.125)))
def via(x,y,n):
 v=p.PCB_VIA(b);v.SetPosition(pt(x,y));v.SetWidth(p.FromMM(.6));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[n]);b.Add(v);copper.append(('seg',n,[0,1],(x,y,x,y,.3)))
route_stats=[]
for net in ['PU_SDA','PU_SCL','+3V3','GND','SDA','SCL']:
 bl=block(net,.25+.125+.045);bv=block(net,.25+.3+.045)
 entries=pads[net];tree=set();first=entries[0]
 for l in first[2]:tree.add((round(first[0]/STEP),round(first[1]/STEP),l))
 for l in first[2]:track((first[0],first[1]),(round(first[0]/STEP)*STEP,round(first[1]/STEP)*STEP),l,net)
 for px,py,ls in entries[1:]:
  starts=[(round(px/STEP),round(py/STEP),l) for l in ls];tx=[q[0] for q in tree];ty=[q[1] for q in tree];xmin,xmax,ymin,ymax=min(tx),max(tx),min(ty),max(ty)
  def h(q):return max(xmin-q[0],0,q[0]-xmax)+max(ymin-q[1],0,q[1]-ymax)
  queue=[];dist={};prev={}
  for q in starts:dist[q]=0;heapq.heappush(queue,(h(q),0,q))
  found=None
  while queue:
   _,cost,q=heapq.heappop(queue)
   if dist[q]!=cost:continue
   if q in tree:found=q;break
   x,y,l=q
   cand=[((x+1,y,l),1),((x-1,y,l),1),((x,y+1,l),1),((x,y-1,l),1)]
   if (x,y) not in bv[0] and (x,y) not in bv[1]:cand.append(((x,y,1-l),12))
   for z,c in cand:
    xx,yy,ll=z
    if not (4<=xx<NX-4 and 4<=yy<NY-4) or (xx,yy) in bl[ll]:continue
    nc=cost+c
    if nc<dist.get(z,1e9):dist[z]=nc;prev[z]=q;heapq.heappush(queue,(nc+h(z),nc,z))
  if found is None:raise RuntimeError('Route failed '+net+' '+str((px,py)))
  path=[found]
  while path[-1] in prev:path.append(prev[path[-1]])
  path.reverse();track((px,py),(path[0][0]*STEP,path[0][1]*STEP),path[0][2],net)
  for a,z in zip(path,path[1:]):
   if a[2]!=z[2]:via(a[0]*STEP,a[1]*STEP,net)
   else:track((a[0]*STEP,a[1]*STEP),(z[0]*STEP,z[1]*STEP),a[2],net)
  tree.update(path)
  for l in ls:tree.add((round(px/STEP),round(py/STEP),l))
  print('routed',net,px,py,len(path),flush=True)
 route_stats.append({'net':net,'terminals':len(entries)})
p.SaveBoard(str(OUT/'hub.kicad_pcb'),b)
(OUT/'hub.kicad_pro').write_text(json.dumps({'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25,'min_via_diameter':.6,'min_through_hole_diameter':.3}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.25,'via_diameter':.6,'via_drill':.3}]}},indent=2))
(OUT/'connectivity.json').write_text(json.dumps(spec,indent=2))
print('Saved native files',flush=True)

# Self-contained copies of the exact standard library assets used.
local=OUT/'libraries';local.mkdir(exist_ok=True)
for lib in set(s['lib'].split(':')[0] for s in spec):
 syms=[v for k,v in defs.items() if k.split(':')[0]==lib]
 (local/(lib+'.kicad_sym')).write_text('(kicad_symbol_lib (version 20241209) (generator "kicad_symbol_editor")'+''.join(syms)+')')
for s in spec:
 lib,fp=s['foot'].split(':');folder=local/(lib+'.pretty');folder.mkdir(exist_ok=True);shutil.copy2(LIB/'footprints'/(lib+'.pretty')/(fp+'.kicad_mod'),folder/(fp+'.kicad_mod'))
for kind,key,ext in [('sym','lib','.kicad_sym'),('fp','foot','.pretty')]:
 names=sorted(set(s[key].split(':')[0] for s in spec))
 (OUT/(kind+'-lib-table')).write_text('('+kind+'_lib_table (version 7)'+''.join('(lib (name "'+n+'") (type "KiCad") (uri "${KIPRJMOD}/libraries/'+n+ext+'") (options "") (descr "Bundled standard KiCad asset"))' for n in names)+')')
