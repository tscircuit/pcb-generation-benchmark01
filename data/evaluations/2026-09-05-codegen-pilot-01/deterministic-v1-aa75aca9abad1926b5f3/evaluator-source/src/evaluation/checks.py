"""Versioned executable rules over normalized artifact facts."""
import itertools, math
from collections import Counter
from .geometry import EPS,audit,distance,primitive


def electronic(facts):
    return {r:c for r,c in facts['components'].items() if c['kind']!='other' or c.get('pins')}


def match_topology(expected,actual,values=False,limit=20000):
    """Bounded graph isomorphism with named connector/part anchors.

Net names and unconstrained designators are irrelevant. Header pins and polarized
terminals are never swapped. Passive and two-terminal switch pins may swap.
"""
    if len(expected)!=len(actual):return None,False
    visits=0;exhausted=False;missing_evidence=False
    def options(e,netmap,used):
        nonlocal missing_evidence
        found=[]
        for ref,a in sorted(actual.items()):
            if ref in used or a['kind']!=e['kind'] or (e.get('ref') and e['ref']!=ref):continue
            if values and e['value'] is not None:
                if a.get('value') is None:missing_evidence=True;continue
                if not math.isclose(a['value'],e['value'],rel_tol=1e-9,abs_tol=1e-15):continue
            pins=a['pins'];ekeys=list(e['pins'])
            if e['kind'] in {'resistor','capacitor','switch','jumper'} and len(pins)==2:
                arrangements=[dict(zip(ekeys,v)) for v in itertools.permutations(sorted(pins))]
            elif set(ekeys)==set(pins):arrangements=[{k:k for k in ekeys}]
            else:
                if not pins or e['kind'] in {'diode','led','transistor'}:missing_evidence=True
                continue
            for arrangement in arrangements:
                extension=dict(netmap);inverse={v:k for k,v in extension.items()};okay=True
                for ep,ap in arrangement.items():
                    en=e['pins'][ep];an=pins[ap]
                    if an is None:missing_evidence=True;okay=False;break
                    if (en in extension and extension[en]!=an) or (an in inverse and inverse[an]!=en):okay=False;break
                    extension[en]=an;inverse[an]=en
                if okay:found.append((ref,extension))
        return found
    def visit(remaining,netmap,assigned):
        nonlocal visits,exhausted
        visits+=1
        if visits>limit:exhausted=True;return None
        if not remaining:return {'roles':assigned,'nets':netmap}
        ranked=[]
        for e in remaining:
            opts=options(e,netmap,set(assigned.values()));ranked.append((len(opts),e['role'],e,opts))
        _,_,e,opts=min(ranked,key=lambda x:(x[0],x[1]))
        for ref,updated in opts:
            answer=visit([v for v in remaining if v['role']!=e['role']],updated,{**assigned,e['role']:ref})
            if answer:return answer
            if exhausted:return None
        return None
    result=visit(expected,{},{});return result, exhausted or (result is None and missing_evidence)


class Checker:
    def __init__(self,facts,rules,run_dir,reader_unsupported=False):
        self.reader_unsupported=reader_unsupported
        self.f=facts;self.rules=rules;self.run_dir=run_dir;self.parts=electronic(facts) if facts else {}
        self.match,self.match_unknown=match_topology(rules['expected_components'],self.parts) if facts else (None,True)
        self.geometry=audit(facts['copper'],.25,facts['unsupported']) if facts else None

    def check(self,rule):
        op=rule['op']
        def decision(value,observed):return ('pass' if value else 'fail'),observed
        def unknown(reason):return 'unknown',{'reason':reason}
        if op=='unknown':return unknown(rule['reason'])
        if op=='readme':
            p=self.run_dir/'artifacts/README.md';return decision(p.is_file() and bool(p.read_text().strip()),{'path':'artifacts/README.md'})
        if op=='artifacts' and self.reader_unsupported:return unknown('Artifact reader does not support this representation; not a deliverable failure')
        if op=='artifacts':return decision(bool(self.f and self.f['source_present'] and self.f['schematic_present'] and self.f['board']),{'scope':'structural parsing, not source replay'})
        if self.f is None:return unknown('Artifact reader failed or required artifact missing')
        if op=='component_counts':
            wanted=Counter(e['kind'] for e in self.rules['expected_components']);actual=Counter(c['kind'] for c in self.parts.values());return decision(wanted==actual,{'expected':dict(wanted),'actual':dict(actual)})
        if op in {'topology','values'}:
            mapping,uncertain=(self.match,self.match_unknown) if op=='topology' else match_topology(self.rules['expected_components'],self.parts,values=True)
            if mapping:return 'pass',{'role_mapping':mapping['roles'],'net_mapping':mapping['nets']}
            if uncertain:return unknown('Missing pin/value semantics or deterministic graph-search limit reached')
            return 'fail',{'reason':'No required netlist isomorphism'+(' with requested values' if op=='values' else '')}
        if op=='net_agreement':
            if any('netlist' in w or 'PCB assignments' in w for w in self.f['warnings']):return unknown('Schematic netlist export unavailable; do not substitute PCB assignment for schematic evidence')
            if not any('pcb_pins' in c for c in self.parts.values()):
                return unknown('Compiled tscircuit source and PCB port links share an intermediate representation; independent schematic/source replay was not performed')
            logical={};pcb={}
            for ref,c in self.parts.items():
                if set(c['pins'])!=set(c.get('pcb_pins',{})):return 'fail',{'component':ref,'reason':'Schematic and PCB pin sets differ'}
                for pin,net in c['pins'].items():logical.setdefault(net,[]).append(ref+'.'+pin)
                for pin,net in c['pcb_pins'].items():pcb.setdefault(net,[]).append(ref+'.'+pin)
            normalize=lambda d:sorted(sorted(v) for v in d.values())
            return decision(normalize(logical)==normalize(pcb),{'logical_partitions':normalize(logical),'pcb_partitions':normalize(pcb)})
        if op in {'routing','shorts','clearance'}:
            key={'routing':'disconnected_nets','shorts':'shorts','clearance':'clearance_violations'}[op];issues=self.geometry[key]
            if issues and (op!='routing' or not self.f['unsupported']):return 'fail',{'issues':issues}
            if self.f['unsupported']:return unknown('Unsupported copper geometry: '+', '.join(sorted(set(self.f['unsupported']))))
            if any(s['net'] is None for s in self.f['copper']):return unknown('Copper has missing net assignments')
            expected_pins={ref+'.'+pin for ref,c in self.parts.items() for pin in c['pins']};actual_pins={s['pin'] for s in self.f['copper'] if s['pin']}
            if expected_pins-actual_pins:return 'fail',{'missing_copper_pads':sorted(expected_pins-actual_pins)}
            return 'pass',{'issues':[],'primitive_count':len(self.f['copper']),'scope':'supported outer copper envelopes; no source/build replay'}
        b=self.f['board'];bounds=b['bounds']
        if op=='board_size':return decision(b.get('rectangular',False) and abs(b['width']-rule['width_mm'])<=rule['tolerance_mm']+EPS and abs(b['height']-rule['height_mm'])<=rule['tolerance_mm']+EPS,{'width_mm':b['width'],'height_mm':b['height']})
        if op=='layers':return decision(b['layers']==rule['count'],{'layers':b['layers']})
        if op=='trace_width':
            widths=[t['width'] for t in self.f['tracks']]
            return decision(bool(widths) and min(widths)+EPS>=rule['minimum_mm'],{'minimum_mm':min(widths) if widths else None})
        if op=='containment':
            missing=[r for r,c in self.parts.items() if c['bounds'] is None]
            outside=[r for r,c in self.parts.items() if c['bounds'] and any([c['bounds'][0]<bounds[0]-EPS,c['bounds'][1]<bounds[1]-EPS,c['bounds'][2]>bounds[2]+EPS,c['bounds'][3]>bounds[3]+EPS])]
            if outside:return 'fail',{'outside':outside}
            return unknown('Component body/courtyard bounds unavailable: '+','.join(missing)) if missing else ('pass',{'outside':[]})
        if op=='header_pitch':
            issues=[]
            for ref,c in self.parts.items():
                if c['kind']!='header':continue
                pads=sorted(c['pads'],key=lambda p:int(p['pin']) if p['pin'].isdigit() else 999)
                if len(pads)<2:return unknown('Insufficient header pad geometry')
                for p in pads:
                    if p['hole']<=0:issues.append({'header':ref,'reason':'Non-through-hole pad'})
                for a,z in zip(pads,pads[1:]):
                    d=math.hypot(a['x']-z['x'],a['y']-z['y'])
                    if abs(d-rule['pitch_mm'])>rule['tolerance_mm']+EPS:issues.append({'header':ref,'pitch_mm':d})
            return decision(not issues,{'issues':issues})
        if op=='packages_0805':
            unrecognized=[]
            for ref,c in self.parts.items():
                if c['kind'] not in {'resistor','capacitor','led'}:continue
                pads=c['pads']
                if len(pads)!=2:unrecognized.append(ref);continue
                a,z=pads;d=math.hypot(a['x']-z['x'],a['y']-z['y'])
                if not (1.6-EPS<=d<=2.2+EPS and all(.8-EPS<=min(p['width'],p['height'])<=1.3+EPS and 1.1-EPS<=max(p['width'],p['height'])<=1.7+EPS and not p['hole'] for p in pads)):unrecognized.append(ref)
            return unknown('Unrecognized 0805 land-pattern geometry: '+','.join(unrecognized)) if unrecognized else ('pass',{'recognition':'two surface pads, centre spacing 1.6–2.2 mm, short side 0.8–1.3 mm and long side 1.1–1.7 mm'})
        if op=='testpads':
            missing=[]
            for ref,c in self.parts.items():
                if c['kind']=='testpoint' and (not c['pads'] or any(min(p['width'],p['height'])+EPS<rule['minimum_mm'] for p in c['pads'])):missing.append(ref)
            return decision(not missing,{'undersized':missing,'exposure_note':'mask opening/material exposure is not independently measured'})
        def ref_for(role):return self.match['roles'].get(role,role) if self.match else role
        def pos(ref):
            c=self.parts.get(ref,{});p=c.get('position');return (p['x'],p['y']) if p else None
        if op in {'edge','position'}:
            p=pos(rule['ref'])
            if p is None:return unknown('Missing component position')
            if op=='position':
                xy=(p[0]-bounds[0],p[1]-bounds[1]);return decision(abs(xy[0]-rule['x_mm'])<=rule['tolerance_mm']+EPS and abs(xy[1]-rule['y_mm'])<=rule['tolerance_mm']+EPS,{'position_from_lower_left_mm':xy})
            d={'left':p[0]-bounds[0],'right':bounds[2]-p[0],'top':bounds[3]-p[1],'bottom':p[1]-bounds[1]}[rule['side']]
            return decision(-EPS<=d<=rule['maximum_mm']+EPS,{'edge_distance_mm':d})
        if op in {'distance','role_distance'}:
            a=pos(ref_for(rule['a']) if op=='role_distance' else rule['a']);z=pos(rule['b'])
            if a is None or z is None:return unknown('Missing/unmatched component position')
            d=math.dist(a,z);return decision(d<=rule['maximum_mm']+EPS,{'distance_mm':d})
        if op in {'row','spacing'}:
            points=[pos(r) for r in rule['refs']]
            if any(p is None for p in points):return unknown('Missing component positions')
            d=min(math.dist(a,z) for a,z in itertools.combinations(points,2))
            valid=d+EPS>=rule['minimum_spacing_mm']
            if op=='row':valid &= all(a[0]<z[0] for a,z in zip(points,points[1:])) and max(p[1] for p in points)-min(p[1] for p in points)<=EPS
            return decision(valid,{'positions_mm':points,'minimum_spacing_mm':d})
        if op=='half':
            if not self.match:return unknown('Component roles could not be matched')
            points=[pos(ref_for(role)) for role in rule['roles']]
            if any(p is None for p in points):return unknown('Missing positions')
            mid=(bounds[1]+bounds[3])/2
            return decision(all(p[1]>=mid-EPS if rule['half']=='top' else p[1]<=mid+EPS for p in points),{'positions_mm':points})
        if op=='net_width':
            if not self.match:return unknown('Net roles unavailable')
            selected={self.match['nets'][n] for n in rule['nets']};widths=[t['width'] for t in self.f['tracks'] if t['net'] in selected]
            return decision(bool(widths) and min(widths)+EPS>=rule['minimum_mm'],{'minimum_mm':min(widths) if widths else None})
        if op=='jumper_gap':
            gaps=[]
            for ref in rule['refs']:
                pads=[s for s in self.f['copper'] if s['pin'] and s['pin'].startswith(ref+'.')]
                if len(pads)!=2:return unknown('Jumper geometry is not two supported pads')
                gaps.append(distance(*pads))
            return decision(all(g+EPS>=rule['minimum_mm'] for g in gaps),{'pad_gaps_mm':gaps})
        if op=='mounting_holes':
            holes=self.f['holes'];off=rule['edge_offset_mm'];expected=[(x,y) for x in [bounds[0]+off,bounds[2]-off] for y in [bounds[1]+off,bounds[3]-off]]
            matched=[]
            for p in expected:
                candidates=[h for h in holes if math.dist(p,(h['x'],h['y']))<=EPS and h['diameter'] is not None and abs(h['diameter']-rule['diameter_mm'])<=EPS]
                if len(candidates)!=1:return 'fail',{'reason':'Missing/misplaced 3.2 mm mounting hole','expected_position':p}
                matched.append(candidates[0])
            issues=[]
            for h in matched:
                hole=primitive([(h['x'],h['y'])],h['diameter']/2,['top','bottom'],None)
                if any(distance(hole,s)+EPS<rule['clearance_mm'] for s in self.f['copper']):issues.append(h)
            if issues:return 'fail',{'hole_copper_clearance_failures':issues}
            return unknown('Copper clears holes, but full component-body distance from holes is not measured')
        raise ValueError('Unknown rule operation: '+str(op))
