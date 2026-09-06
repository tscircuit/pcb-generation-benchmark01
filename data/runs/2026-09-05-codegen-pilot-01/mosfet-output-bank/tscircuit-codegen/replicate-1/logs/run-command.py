import sys,subprocess,pathlib,time,json,datetime
root=pathlib.Path(__file__).resolve().parent.parent
attempt,name,*cmd=sys.argv[1:]
p=root/'logs'/f'{attempt}-{name}.log'
t=time.monotonic()
with p.open('w') as out:
 out.write('$ '+__import__('shlex').join(cmd)+'\n');out.flush()
 try: r=subprocess.run(cmd,cwd=root/'artifacts'/attempt,stdout=out,stderr=subprocess.STDOUT,timeout=240); code=r.returncode
 except subprocess.TimeoutExpired: code=124;out.write('\nTIMEOUT after 240 seconds\n')
 out.write(f'\nEXIT_CODE={code}\n')
with (root/'logs'/'commands.jsonl').open('a') as f:f.write(json.dumps({'attempt':attempt,'name':name,'command':cmd,'exit_code':code,'seconds':time.monotonic()-t,'log':str(p.relative_to(root))})+'\n')
print(p.read_text()[-12000:])
