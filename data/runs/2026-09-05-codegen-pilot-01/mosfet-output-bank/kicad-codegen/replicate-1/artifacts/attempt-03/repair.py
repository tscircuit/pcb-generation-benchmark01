from pathlib import Path
p=Path(__file__).with_name('generate.py');s=p.read_text();s=s.replace("u=uid();c['uuid']=u","x=round(x/1.27)*1.27;y=round(y/1.27)*1.27\n u=uid();c['uuid']=u")
s=s.replace('p.NETINFO_ITEM(board,name)','p.NETINFO_ITEM(board,"/"+name)')
s=s.replace("fp.SetReference(c['ref']);","fp.SetFPID(p.LIB_ID(lib,name));fp.SetReference(c['ref']);")
s=s.replace("fp.Value().SetVisible(False)","fp.Value().SetVisible(False)\n if c['ref']=='C2':fp.Reference().SetPosition(pt(c['x'],c['y']+2.5))")
s=s.replace("t.SetPosition(pt(c['x']-5,c['y']+k*2.54));t.SetTextSize(pt(.7,.7))","t.SetPosition(pt(27 if c['ref']=='J1' else 24 if c['ref']=='J2' else 75,c['y']+k*2.54 if c['ref'] in ['J1','J2'] else c['y']+5.2+k*1.6));t.SetTextSize(pt(.85,.85))")
s += '''\nfor typ,names in [('sym',sorted({c['lib'].split(':')[0] for c in components})),('fp',sorted({c['fp'].split(':')[0] for c in components}))]:
 entries=[]
 for name in names:
  uri=LIB/('symbols' if typ=='sym' else 'footprints')/(name+('.kicad_sym' if typ=='sym' else '.pretty'))
  entries.append(f'(lib (name "{name}") (type "KiCad") (uri "{uri}") (options "") (descr ""))')
 (HERE/(typ+'-lib-table')).write_text('('+typ+'_lib_table (version 7) '+' '.join(entries)+')')
'''
p.write_text(s)
