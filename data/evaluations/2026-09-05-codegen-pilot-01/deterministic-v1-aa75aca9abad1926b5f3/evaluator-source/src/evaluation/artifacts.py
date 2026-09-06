"""Read artifacts as data. Never import or execute generated design scripts."""
import json, math, re
import xml.etree.ElementTree as ET
from pathlib import Path
from .geometry import Union, primitive, rounded_rect


class UnsupportedArtifact(ValueError):
    """Valid/ambiguous artifact beyond the reader's declared capability."""


def sexpr(text):
    tokens=re.findall(r'"(?:\\.|[^"\\])*"|[()]|[^\s()]+',text)
    stack=[];root=None
    for token in tokens:
        if token=='(':
            item=[]
            if stack:stack[-1].append(item)
            elif root is not None:raise ValueError('Multiple S-expression roots')
            stack.append(item)
        elif token==')':
            if not stack:raise ValueError('Unbalanced S-expression')
            item=stack.pop()
            if not stack:root=item
        else:
            if not stack:raise ValueError('Atom outside S-expression')
            stack[-1].append(json.loads(token) if token.startswith('"') else token)
    if stack or root is None:raise ValueError('Incomplete S-expression')
    return root


def children(node,key):return [x for x in node if isinstance(x,list) and x and x[0]==key]
def child(node,key,default=None):return next(iter(children(node,key)),default)
def atom(node,key,default=None):
    x=child(node,key)
    return x[1] if x and len(x)>1 else default

def number(value):
    if value is None:return None
    if isinstance(value,(int,float)) and not isinstance(value,bool):
        return float(value) if math.isfinite(value) else None
    text=str(value).replace('Ω','').replace('ohm','').replace('µ','u').replace('μ','u').strip()
    match=re.fullmatch(r'([0-9]+(?:\.[0-9]+)?)\s*([pnumkKMGR]?)(?:F|V)?',text)
    if not match:
        match=re.fullmatch(r'([0-9]+)([RkKMmunp])([0-9]+)',text)
        if match:return float(match[1]+'.'+match[3])*{'R':1,'k':1e3,'K':1e3,'M':1e6,'m':1e-3,'u':1e-6,'n':1e-9,'p':1e-12}[match[2]]
        return None
    return float(match[1])*{'':1,'R':1,'p':1e-12,'n':1e-9,'u':1e-6,'m':1e-3,'k':1e3,'K':1e3,'M':1e6,'G':1e9}[match[2]]


def kind(ref,ftype=''):
    for prefix,name in [('TP','testpoint'),('JP','jumper'),('SW','switch'),('R','resistor'),('C','capacitor'),('J','header'),('Q','transistor'),('D','diode')]:
        if ref.startswith(prefix):return 'led' if 'led' in ftype.lower() else name
    return 'other'


def semantic(pin,hints):
    hints=[str(x).lower() for x in hints]
    for key,aliases in [('A',{'a','anode'}),('K',{'k','cathode'}),('B',{'b','base'}),('C',{'c','collector'}),('E',{'e','emitter'}),('G',{'g','gate'}),('S',{'s','source'}),('D',{'d','drain'})]:
        if any(h in aliases for h in hints):return key
    return str(pin)


def blank():return {'components':{},'copper':[],'unsupported':[],'silkscreen':[],'holes':[], 'tracks':[], 'files':[], 'board':None, 'schematic_present':False,'source_present':False,'warnings':[]}


def load_tscircuit(final):
    f=blank();files=sorted(final.rglob('circuit.json'))
    if len(files)>1:raise UnsupportedArtifact('Ambiguous multiple circuit.json files')
    if not files:raise ValueError('Missing circuit.json')
    f['files']=[files[0]];data=json.loads(files[0].read_text())
    if not isinstance(data,list):raise ValueError('circuit.json must be an array')
    get=lambda t:[o for o in data if o.get('type')==t]
    boards=get('pcb_board')
    if len(boards)!=1:raise ValueError('Expected one PCB board')
    b=boards[0];cx=b['center']['x'];cy=b['center']['y'];w=b['width'];h=b['height']
    f['board']={'width':w,'height':h,'layers':b['num_layers'],'bounds':[cx-w/2,cy-h/2,cx+w/2,cy+h/2], 'rectangular':not bool(b.get('outline'))}
    if b.get('outline'):f['unsupported'].append('custom board outline')
    source_ids={o['source_component_id'] for o in get('source_component')}
    schematic_ids={o.get('source_component_id') for o in get('schematic_component')}
    f['schematic_present']=bool(source_ids) and source_ids<=schematic_ids
    f['source_present']=any(p.stat().st_size>0 for p in final.glob('*.tsx'))
    sources={o['source_component_id']:o for o in get('source_component')}; ports={o['source_port_id']:o for o in get('source_port')};uf=Union()
    for sid in ports:uf.find(sid)
    for t in get('source_trace'):
        ids=t.get('connected_source_port_ids',[])+t.get('connected_source_net_ids',[])
        for sid in ids[1:]:uf.join(ids[0],sid)
    for s in sources.values():
        for group in s.get('internally_connected_source_port_ids',[]):
            for sid in group[1:]:uf.join(group[0],sid)
    pcbs={o['source_component_id']:o for o in get('pcb_component')}
    physical={o['pcb_port_id']:o for o in get('pcb_port')};logical={}
    for sid,s in sources.items():
        ref=s['name'];p=pcbs.get(sid,{});comp={'kind':kind(ref,s.get('ftype','')),'value':s.get('resistance',s.get('capacitance')),'pins':{},'position':p.get('center'),'bounds':None,'footprint':None,'pads':[], 'part':s.get('manufacturer_part_number'),'color':s.get('color')}
        if p.get('center') and p.get('width') is not None:
            c=p['center'];comp['bounds']=[c['x']-p['width']/2,c['y']-p['height']/2,c['x']+p['width']/2,c['y']+p['height']/2]
        groups=s.get('internally_connected_source_port_ids',[])
        for pid,port in ports.items():
            if port['source_component_id']!=sid:continue
            key=semantic(port.get('pin_number',port['name']),port.get('port_hints',[])) if comp['kind'] in {'diode','led','transistor'} else str(port.get('pin_number',port['name']))
            if groups:
                key=next((str(i+1) for i,g in enumerate(groups) if pid in g),key)
            comp['pins'][key]=uf.find(pid);logical[pid]=(ref,key,uf.find(pid))
        f['components'][ref]=comp
    for o in get('pcb_smtpad')+get('pcb_plated_hole'):
        port=physical.get(o.get('pcb_port_id'));info=logical.get(port.get('source_port_id')) if port else None
        if not info:f['unsupported'].append('pad missing logical port');continue
        ref,key,net=info;shape=o.get('shape');x=o['x'];y=o['y'];layers=o.get('layers',[o.get('layer','top')]);a=o.get('ccw_rotation',o.get('rect_ccw_rotation',0))
        if shape=='circle':
            diameter=o.get('radius',0)*2 or o.get('diameter') or o.get('outer_diameter');geom=primitive([(x,y)],diameter/2,layers,net,ref+'.'+key) if diameter else None
        elif shape in {'rect','rotated_rect','roundrect','circular_hole_with_rect_pad','pill'}:
            w=o.get('width',o.get('rect_pad_width'));h=o.get('height',o.get('rect_pad_height'));radius=o.get('radius',o.get('rect_border_radius',0))
            if shape=='pill':radius=min(w,h)/2
            geom=rounded_rect(x,y,w,h,a,radius,layers,net,ref+'.'+key)
        else:geom=None
        if geom:f['copper'].append(geom)
        else:f['unsupported'].append('unsupported pad shape '+str(shape))
        f['components'][ref]['pads'].append({'pin':key,'x':x,'y':y,'shape':shape,'width':o.get('width',o.get('rect_pad_width',o.get('outer_diameter',o.get('radius',0)*2))),'height':o.get('height',o.get('rect_pad_height',o.get('outer_diameter',o.get('radius',0)*2))),'hole':o.get('hole_diameter',0)})
    for trace in get('pcb_trace'):
        source=next((s for s in get('source_trace') if s['source_trace_id']==trace.get('source_trace_id')),None)
        ids=source.get('connected_source_port_ids',[]) if source else []
        if ids:net=uf.find(ids[0])
        else:
            cp=trace.get('connectsTo',[]);net=logical[physical[cp[0]]['source_port_id']][2] if cp and cp[0] in physical else None
        if net is None:f['unsupported'].append('trace missing logical net')
        route=trace.get('route',[])
        for left,right in zip(route,route[1:]):
            if left['route_type']==right['route_type']=='wire' and left['layer']==right['layer']:
                width=left['width'];f['copper'].append(primitive([(left['x'],left['y']),(right['x'],right['y'])],width/2,[left['layer']],net));f['tracks'].append({'width':width,'net':net})
        for v in route:
            if v['route_type']=='via':f['copper'].append(primitive([(v['x'],v['y'])],v['via_diameter']/2,[v['from_layer'],v['to_layer']],net))
            elif v['route_type']!='wire':f['unsupported'].append('unsupported route element')
    f['silkscreen']=[o.get('text','') for o in get('pcb_silkscreen_text')]
    for o in get('pcb_hole'):
        f['holes'].append({'x':o['x'],'y':o['y'],'diameter':o.get('hole_diameter',o.get('diameter'))})
    for o in data:
        if o.get('type') in {'pcb_copper_pour','pcb_copper_text','pcb_panel'}:f['unsupported'].append(o['type'])
    return f


def load_kicad(final):
    f=blank();boards=sorted(final.glob('*.kicad_pcb'));schematics=sorted(final.glob('*.kicad_sch'));netlists=sorted(final.glob('*.net')) or sorted(final.glob('*.net.xml'))
    if len(boards)>1:raise UnsupportedArtifact('Ambiguous multiple native boards')
    if not boards:raise ValueError('Missing native board')
    tree=sexpr(boards[0].read_text())
    if tree[0]!='kicad_pcb':raise ValueError('Invalid PCB root')
    f['files']=boards+schematics+netlists;f['source_present']=True
    f['schematic_present']=len(schematics)==1 and sexpr(schematics[0].read_text())[0]=='kicad_sch' and bool(children(sexpr(schematics[0].read_text()),'symbol'))
    layer_map={x[0]:x[1] for x in child(tree,'layers',[])[1:] if isinstance(x,list) and len(x)>1}
    copper_layers=[name for name in layer_map.values() if name.endswith('.Cu')]
    edgepts=[]
    for key in ['gr_line','gr_rect']:
        for g in children(tree,key):
            if atom(g,'layer')=='Edge.Cuts':
                for e in ['start','end']:edgepts.append(tuple(map(float,child(g,e)[1:3])))
    if not edgepts:
        if any(atom(g,'layer')=='Edge.Cuts' for g in children(tree,'gr_poly')+children(tree,'gr_arc')+children(tree,'gr_circle')):
            raise UnsupportedArtifact('Board outline representation is unsupported')
        raise ValueError('Missing board outline')
    minx,miny,maxx,maxy=min(x for x,y in edgepts),min(y for x,y in edgepts),max(x for x,y in edgepts),max(y for x,y in edgepts)
    corners={(minx,miny),(maxx,miny),(maxx,maxy),(minx,maxy)}
    expected_edges={frozenset((a,z)) for a,z in [((minx,miny),(maxx,miny)),((maxx,miny),(maxx,maxy)),((maxx,maxy),(minx,maxy)),((minx,maxy),(minx,miny))]}
    actual_edges={frozenset((tuple(map(float,child(g,'start')[1:3])),tuple(map(float,child(g,'end')[1:3])))) for g in children(tree,'gr_line') if atom(g,'layer')=='Edge.Cuts'}
    rects=[g for g in children(tree,'gr_rect') if atom(g,'layer')=='Edge.Cuts']
    rectangular=(actual_edges==expected_edges and not rects) or (len(rects)==1 and not actual_edges)
    if any(atom(g,'layer')=='Edge.Cuts' for g in children(tree,'gr_arc')+children(tree,'gr_circle')+children(tree,'gr_poly')):rectangular=False
    f['board']={'width':maxx-minx,'height':maxy-miny,'layers':len(copper_layers),'bounds':[minx,-maxy,maxx,-miny],'rectangular':rectangular}
    netnames={o[1]:o[2] for o in children(tree,'net') if len(o)>2}
    resolve_net=lambda value: netnames.get(value, value if value and not str(value).isdigit() else None)
    # Freshness is deliberately a separate unknown rule: exported .net files are evidence, not proof of a replay.
    logical={};pin_names={};lib_ids={}
    if len(netlists)==1:
        raw=netlists[0].read_text()
        if raw.lstrip().startswith('<'):
            def convert(element):
                return [element.tag]+[[k,v] for k,v in element.attrib.items()]+([element.text.strip()] if element.text and element.text.strip() else [])+[convert(c) for c in element]
            net=convert(ET.fromstring(raw))
        else:net=sexpr(raw)
        for c in child(net,'components',[])[1:]:
            if not isinstance(c,list) or c[0]!='comp':continue
            ref=atom(c,'ref');libsrc=child(c,'libsource',[]);lib_ids[ref]=(atom(libsrc,'lib'),atom(libsrc,'part'))
            logical[ref]={'kind':kind(ref,str(atom(libsrc,'part',''))),'value':number(atom(c,'value')),'pins':{},'part':atom(c,'value')}
        libparts={}
        for l in child(net,'libparts',[])[1:]:
            if not isinstance(l,list) or l[0]!='libpart':continue
            libparts[(atom(l,'lib'),atom(l,'part'))]={atom(p,'num'):atom(p,'name','') for p in child(l,'pins',[])[1:] if isinstance(p,list) and p[0]=='pin'}
        for n in child(net,'nets',[])[1:]:
            if not isinstance(n,list) or n[0]!='net':continue
            name=atom(n,'name')
            for node in children(n,'node'):
                ref=atom(node,'ref');pin=atom(node,'pin')
                if ref not in logical:continue
                hint=atom(node,'pinfunction') or libparts.get(lib_ids.get(ref),{}).get(pin,'')
                key=semantic(pin,[hint]) if logical[ref]['kind'] in {'diode','led','transistor'} else pin
                logical[ref]['pins'][key]=name;pin_names[(ref,pin)]=key
    else:f['warnings'].append('missing or ambiguous schematic netlist export')
    embedded={}
    if len(schematics)==1:
        sch=sexpr(schematics[0].read_text())
        for symbol in child(sch,'lib_symbols',[])[1:]:
            if not isinstance(symbol,list) or symbol[0]!='symbol':continue
            mappings={}
            for unit in children(symbol,'symbol'):
                for pin in children(unit,'pin'):mappings[atom(pin,'number')]=atom(pin,'name','')
            embedded[symbol[1]]=mappings
        for instance in children(sch,'symbol'):
            props={o[1]:o[2] for o in children(instance,'property')};ref=props.get('Reference');lib=atom(instance,'lib_id','')
            if ref and ref not in logical:
                logical[ref]={'kind':kind(ref,lib),'value':number(props.get('Value')),'pins':{},'part':props.get('Value')}
                for pin,hint in embedded.get(lib,{}).items():
                    pin_names[(ref,pin)]=semantic(pin,[hint]) if logical[ref]['kind'] in {'diode','led','transistor'} else pin
    pcb_nets={}
    for fp in children(tree,'footprint'):
        props={o[1]:o[2] for o in children(fp,'property')};ref=props.get('Reference')
        if not ref:
            ref=next((o[2] for o in children(fp,'fp_text') if o[1]=='reference'),None)
        if not ref:raise ValueError('Unnamed footprint')
        at=list(map(float,child(fp,'at',[0,0,0])[1:]));x,y=at[:2];angle=at[2] if len(at)>2 else 0;c=math.cos(math.radians(angle));s=math.sin(math.radians(angle))
        transform=lambda dx,dy:(x+dx*c+dy*s,-y+dx*s-dy*c)
        comp=logical.get(ref,{'kind':kind(ref,props.get('Value','')),'value':number(props.get('Value')),'pins':{},'part':props.get('Value')}).copy()
        comp.update(position={'x':x,'y':-y},footprint=fp[1],pads=[],bounds=None)
        body=[];assigned={}
        for pad in children(fp,'pad'):
            pin=pad[1];key=pin_names.get((ref,pin),pin);pos=list(map(float,child(pad,'at',[0,0,0])[1:]));px,py=transform(*pos[:2]);pa=pos[2] if len(pos)>2 else angle
            size=list(map(float,child(pad,'size',[0,0,0])[1:3]));w,h=size
            net=atom(pad,'net');net=resolve_net(net)
            layers=child(pad,'layers',[])[1:];layers=copper_layers if '*.Cu' in layers or '*.Cu' in str(layers) else [v for v in layers if v.endswith('.Cu')]
            normalized_layers=['top' if l=='F.Cu' else 'bottom' if l=='B.Cu' else l for l in layers]
            drill=child(pad,'drill');diameter=float(drill[1]) if drill and drill[1]!='oval' else 0
            if pad[2]=='np_thru_hole':
                f['holes'].append({'x':px,'y':py,'diameter':diameter});continue
            shape=pad[3];geom=None
            if shape=='circle':geom=primitive([(px,py)],w/2,normalized_layers,net,ref+'.'+key)
            elif shape in {'rect','roundrect','oval'}:
                radius=min(w,h)*float(atom(pad,'roundrect_rratio',0)) if shape=='roundrect' else min(w,h)/2 if shape=='oval' else 0
                geom=rounded_rect(px,py,w,h,pa,radius,normalized_layers,net,ref+'.'+key)
            if geom:f['copper'].append(geom);body.extend([(geom['bounds'][0],geom['bounds'][1]),(geom['bounds'][2],geom['bounds'][3])])
            else:f['unsupported'].append('unsupported native pad '+shape)
            comp['pads'].append({'pin':key,'x':px,'y':py,'shape':shape,'width':w,'height':h,'hole':diameter})
            assigned[key]=net
        # Include declared courtyard bounds, not just pad extents.
        for g in children(fp,'fp_line')+children(fp,'fp_rect'):
            if atom(g,'layer') in {'F.CrtYd','B.CrtYd'}:
                for e in ['start','end']:
                    v=child(g,e)
                    if v:body.append(transform(float(v[1]),float(v[2])))
        if body:comp['bounds']=[min(a for a,b in body),min(b for a,b in body),max(a for a,b in body),max(b for a,b in body)]
        comp['origin']=comp['position']
        if comp['bounds']:
            bb=comp['bounds'];comp['position']={'x':(bb[0]+bb[2])/2,'y':(bb[1]+bb[3])/2}
        comp['pcb_pins']=assigned
        if not comp['pins']:
            comp['pins']=assigned.copy();f['warnings'].append('logical topology uses PCB assignments because schematic netlist is absent')
        f['components'][ref]=comp
        for t in children(fp,'fp_text'):
            if atom(t,'layer') in {'F.SilkS','B.SilkS'}:f['silkscreen'].append(t[2])
        for t in children(fp,'property'):
            if atom(t,'layer') in {'F.SilkS','B.SilkS'}:f['silkscreen'].append(t[2])
    for seg in children(tree,'segment'):
        a=child(seg,'start');b=child(seg,'end');width=float(atom(seg,'width'));net=resolve_net(atom(seg,'net'));layer=atom(seg,'layer');layer='top' if layer=='F.Cu' else 'bottom' if layer=='B.Cu' else layer
        f['copper'].append(primitive([(float(a[1]),-float(a[2])),(float(b[1]),-float(b[2]))],width/2,[layer],net));f['tracks'].append({'width':width,'net':net})
    for via in children(tree,'via'):
        a=child(via,'at');ls=child(via,'layers',[])[1:];ls=['top' if l=='F.Cu' else 'bottom' if l=='B.Cu' else l for l in ls]
        f['copper'].append(primitive([(float(a[1]),-float(a[2]))],float(atom(via,'size'))/2,ls,resolve_net(atom(via,'net'))))
    f['silkscreen'] += [g[1] for g in children(tree,'gr_text') if atom(g,'layer') in {'F.SilkS','B.SilkS'}]
    if children(tree,'arc') or children(tree,'zone'):f['unsupported'].append('native copper arc or zone')
    return f
