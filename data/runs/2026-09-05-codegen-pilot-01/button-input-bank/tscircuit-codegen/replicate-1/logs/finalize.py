import json,datetime,pathlib
root=pathlib.Path('.')
now=datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00','Z')
limitations=["J1 schematic box too wide warning remains in selected attempt despite exit code 0.","Automatic J1 supplier footprint mismatch; generic 2.54 mm through-hole header is the design intent, not the auto-selected supplier item.","Minimum physical copper clearance and independent geometric opens check are unmeasured; configured clearances are 0.25 mm.","Generic switch footprint requires a matching physical normally-open momentary component with 1/2 and 3/4 internal terminal pairs.","Attempt 3 has an empty schematic preview and is not selected; original artifacts retained."]
validation={}
for name in ['netlist','schematic-placement','placement','build','shorts','connectivity-audit']:
 prefix='logs/attempt-02-'+name
 validation[name]={'status':'warning' if name=='schematic-placement' else 'passed','exit_code':int(pathlib.Path(prefix+'.exit').read_text()),'log_path':prefix+'.log'}
validation['minimum_physical_copper_clearance_mm']=None
files=[str(p) for p in pathlib.Path('artifacts').rglob('*') if p.is_file()]
result={'status':'completed','final_attempt':'attempt-02','generated_files':files,'validation':validation,'known_limitations':limitations,'failure':None,'correctness_certified':False,'attempt_count':3}
pathlib.Path('result.json').write_text(json.dumps(result,indent=2)+'\n')
p=pathlib.Path('run.json');d=json.loads(p.read_text());d['status']='completed';d['ended_at']=now
d['usage']['wall_time_seconds']=(datetime.datetime.fromisoformat(now.replace('Z','+00:00'))-datetime.datetime.fromisoformat(d['started_at'].replace('Z','+00:00'))).total_seconds()
d['attempts']=[{'attempt':i,'path':f'artifacts/attempt-{i:02d}','outcome':outcome} for i,outcome in [(1,'header omitted due to invalid pin label; retained'),(2,'selected; routed with documented warnings'),(3,'empty schematic preview; retained, not selected')]]
d['artifacts']=files;d['failure']=None;p.write_text(json.dumps(d,indent=2)+'\n')
print(json.dumps({'status':d['status'],'selected':result['final_attempt'],'wall_time_seconds':d['usage']['wall_time_seconds'],'files':len(files)},indent=2))
