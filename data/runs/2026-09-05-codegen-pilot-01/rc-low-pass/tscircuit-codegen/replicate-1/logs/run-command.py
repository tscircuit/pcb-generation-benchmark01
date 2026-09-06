import subprocess,sys,json,datetime,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
attempt,label,*cmd=sys.argv[1:]
log=root/'logs'/f'{attempt}-{label}.log'
start=datetime.datetime.now(datetime.timezone.utc).isoformat()
p=subprocess.run(cmd,cwd=root/'artifacts'/attempt,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
log.write_text(p.stdout)
with (root/'logs'/'commands.jsonl').open('a') as f:f.write(json.dumps({'started_at':start,'ended_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'cwd':str(root/'artifacts'/attempt),'command':cmd,'exit_code':p.returncode,'log':str(log.relative_to(root))})+'\n')
print(f'{label}: exit {p.returncode}\n'+p.stdout[-9000:])
