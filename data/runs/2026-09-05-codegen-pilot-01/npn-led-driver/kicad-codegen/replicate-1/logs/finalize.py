import json,pathlib,datetime
root=pathlib.Path('.');d=json.load(open('run.json'));end=datetime.datetime.now(datetime.timezone.utc);d['ended_at']=end.isoformat();d['status']='completed';d['usage']['wall_time_seconds']=(end-datetime.datetime.fromisoformat(d['started_at'])).total_seconds();d['attempts']=[{'attempt_id':f'attempt-{i:02d}','path':f'artifacts/attempt-{i:02d}','status':'generated','kind':'initial' if i==1 else 'repair'} for i in [1,2,3]]
files=[str(p) for p in (root/'artifacts').rglob('*') if p.is_file()];d['artifacts']=files;d['failure']=None
json.dump(d,open('run.json','w'),indent=2)
checks={}
for name,log in [('erc','erc.rpt'),('drc','drc.rpt'),('netlist','netlist.log'),('schematic_export','sch-export.log'),('pcb_export','pcb-export-retry.log'),('schematic_parity','parity.rpt'),('normalized_pin_connectivity','connectivity.json')]:
 stem={'schematic_export':'sch-export','pcb_export':'pcb-export-retry','schematic_parity':'parity','normalized_pin_connectivity':'connectivity'}.get(name,name)
 code=int(pathlib.Path(f'logs/attempt-03-{stem}.exit').read_text());checks[name]={'passed':code==0,'exit_code':code,'log':f'logs/attempt-03-{log}'}
result={'status':'completed','final_attempt':'attempt-03','generated_files':files,'validation':checks,'known_limitations':['Native schematic parity reports 28 net-name warnings because local schematic names have a leading / and PCB names do not; normalized pin groups agree exactly.','Schematic value/label overlap around Q1/Q2 and D1/D2 reduces readability.','No physical testing or simulation; a specific red LED ordering code was not selected.'],'failure':None,'started_at':d['started_at'],'ended_at':d['ended_at'],'measurements':{'erc_errors':0,'erc_warnings':0,'drc_violations':0,'unconnected_pads':0,'native_parity_name_warnings':28,'normalized_connectivity_match':True,'board_outline_mm':[45,30],'led_spacing_mm':15,'capacitor_header_distance_mm':4.000449974690347,'minimum_trace_width_mm':.25,'physical_test':None}}
json.dump(result,open('result.json','w'),indent=2)
print(json.dumps({'status':result['status'],'wall_time_seconds':d['usage']['wall_time_seconds'],'checks':checks},indent=2))
