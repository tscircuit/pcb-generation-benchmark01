"""Deterministic distances between convex copper primitives (millimetres)."""
import math
EPS = 1e-6


def cross(a, b, c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])


def point_segment(p, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    den = dx*dx+dy*dy
    t = max(0, min(1, ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den)) if den else 0
    return math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dy)


def segments(a,b,c,d):
    ab_c, ab_d, cd_a, cd_b = cross(a,b,c), cross(a,b,d), cross(c,d,a), cross(c,d,b)
    if ab_c*ab_d < 0 and cd_a*cd_b < 0:
        return 0.0
    return min(point_segment(a,c,d), point_segment(b,c,d), point_segment(c,a,b), point_segment(d,a,b))


def inside(p, vertices):
    if len(vertices)<3:
        return False
    values=[cross(a,b,p) for a,b in zip(vertices,vertices[1:]+vertices[:1])]
    return all(x>=-EPS for x in values) or all(x<=EPS for x in values)


def edges(vertices):
    return list(zip(vertices,vertices[1:]+vertices[:1])) if len(vertices)>1 else [(vertices[0],vertices[0])]


def distance(a,b):
    av,bv=a['vertices'],b['vertices']
    if inside(av[0],bv) or inside(bv[0],av):
        gap=0.0
    else:
        gap=min(segments(x,y,z,w) for x,y in edges(av) for z,w in edges(bv))
    return max(0.0,gap-a['radius']-b['radius'])


def primitive(vertices, radius, layers, net, pin=None):
    if not vertices or radius<0 or not all(math.isfinite(v) for p in vertices for v in p):
        raise ValueError('Invalid copper geometry')
    return {'vertices':[tuple(p) for p in vertices], 'radius':radius, 'layers':sorted(set(layers)), 'net':net,'pin':pin,
            'bounds':[min(p[0] for p in vertices)-radius,min(p[1] for p in vertices)-radius,max(p[0] for p in vertices)+radius,max(p[1] for p in vertices)+radius]}


def rounded_rect(x,y,w,h,angle,radius,layers,net,pin=None):
    if w<=0 or h<=0 or radius<0 or radius>min(w,h)/2+EPS:
        raise ValueError('Invalid pad dimensions')
    c,s=math.cos(math.radians(angle)), math.sin(math.radians(angle))
    dx,dy=w/2-radius,h/2-radius
    vertices=[(x+a*c-b*s,y+a*s+b*c) for a,b in [(-dx,-dy),(dx,-dy),(dx,dy),(-dx,dy)]]
    return primitive(vertices,radius,layers,net,pin)


class Union:
    def __init__(self): self.parent={}
    def find(self,x):
        self.parent.setdefault(x,x)
        if self.parent[x]!=x:self.parent[x]=self.find(self.parent[x])
        return self.parent[x]
    def join(self,a,b):
        a,b=self.find(a),self.find(b)
        if a!=b:self.parent[max(a,b)]=min(a,b)


def audit(shapes, clearance, unsupported):
    """Sweep only pairs whose bounding boxes could touch/violate clearance."""
    uf=Union();bad=[];shorts=[]
    order=sorted(range(len(shapes)),key=lambda i:(shapes[i]['bounds'][0],i))
    for index,i in enumerate(order):
        a=shapes[i];uf.find(i)
        for j in order[index+1:]:
            b=shapes[j]
            if b['bounds'][0]>a['bounds'][2]+clearance+EPS:break
            if a['bounds'][1]>b['bounds'][3]+clearance+EPS or b['bounds'][1]>a['bounds'][3]+clearance+EPS:continue
            if not set(a['layers']) & set(b['layers']):continue
            gap=distance(a,b)
            if gap<=EPS:uf.join(i,j)
            if a['net']!=b['net'] and a['net'] is not None and b['net'] is not None:
                if gap+EPS<clearance:bad.append({'a':i,'b':j,'clearance_mm':round(gap,9)})
                if gap<=EPS:shorts.append({'a':i,'b':j})
    # Physical connectivity joins copper, including plated pads/vias spanning layers.
    pins={}
    for i,s in enumerate(shapes):
        if s['pin'] is not None:pins.setdefault(s['net'],{}).setdefault(s['pin'],set()).add(uf.find(i))
    disconnected=[]
    for net,members in pins.items():
        roots=set().union(*members.values()) if members else set()
        if len(roots)>1:disconnected.append({'net':net,'copper_islands':len(roots),'pins':sorted(members)})
    return {'clearance_violations':bad,'shorts':shorts,'disconnected_nets':disconnected,
            'unsupported_geometry':sorted(set(unsupported)), 'primitive_count':len(shapes)}
