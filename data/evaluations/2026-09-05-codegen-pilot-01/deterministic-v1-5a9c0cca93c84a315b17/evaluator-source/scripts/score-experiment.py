#!/usr/bin/env python3
"""Score frozen artifacts; content-addressed output, no mutation or model calls."""
import argparse,hashlib,json,platform,re,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from src.evaluation.artifacts import load_kicad,load_tscircuit,UnsupportedArtifact
from src.evaluation.checks import Checker
from src.evaluation.scoring import score,validate_rules,CATEGORIES


def dump(value):return (json.dumps(value,indent=2,sort_keys=True,allow_nan=False)+'\n').encode()
def sha(raw):return hashlib.sha256(raw).hexdigest()
def safe(base,path):
    resolved=(base/path).resolve()
    if not resolved.is_relative_to(base.resolve()):raise ValueError('Path escapes run directory: '+str(path))
    return resolved


def collect(run_dir):
    run=json.loads((run_dir/'run.json').read_text())
    result=json.loads((run_dir/'result.json').read_text()) if (run_dir/'result.json').exists() else {}
    final=result.get('final_attempt')
    if isinstance(final,int) and not isinstance(final,bool):final=f'artifacts/attempt-{final:02d}'
    if isinstance(final,str):
        path=safe(run_dir,final)
        if not path.exists():path=safe(run_dir,'artifacts/'+final)
        final=path if path.is_dir() else None
    else:final=None
    files=[p for p in [run_dir/'run.json',run_dir/'result.json',run_dir/'input/prompt.md',run_dir/'input/metadata.json',run_dir/'artifacts/README.md'] if p.is_file()]
    if final:
        files += [p for p in final.rglob('*') if p.is_file() and not p.is_symlink() and not any(k in p.relative_to(final).parts for k in ['node_modules','.git','.venv','__pycache__'])]
    files=sorted(set(files));manifest=[{'path':str(p.relative_to(ROOT)),'sha256':sha(p.read_bytes())} for p in files]
    return run,final,manifest


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('experiment_id');args=parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]*',args.experiment_id):raise ValueError('Invalid experiment ID')
    config_path=ROOT/'configs'/f'{args.experiment_id}.json';config=json.loads(config_path.read_text())
    versions={'evaluator':'1.0.0','python':platform.python_version(),'artifact_readers':'stdlib-only; no external native tool replay'}
    rubric=json.loads((ROOT/'evaluation/rubric-v1.json').read_text())
    if rubric.get('version')!='1.0.0' or rubric.get('weights')!=CATEGORIES:
        raise ValueError('Rubric version/weights differ from the implemented scoring contract')
    code_files=sorted((ROOT/'src/evaluation').glob('*.py'))+[Path(__file__).resolve(),ROOT/'evaluation/rubric-v1.json']
    sources={str(p.relative_to(ROOT)):p.read_bytes() for p in code_files};code_hash=sha(dump({p:sha(raw) for p,raw in sources.items()}))
    decisions=[];frozen_rules={};all_inputs={};seen=set()
    for item in config['execution_order']:
        if not all(re.fullmatch(r'[a-z0-9][a-z0-9-]*',item[k]) for k in ['prompt_id','method']):raise ValueError('Invalid prompt/method ID')
        key=(item['prompt_id'],item['method'])
        if key in seen:raise ValueError('Duplicate prompt-method entry')
        seen.add(key)
        run_dir=ROOT/'data/runs'/args.experiment_id/item['prompt_id']/item['method']/'replicate-1'
        run,final,manifest=collect(run_dir)
        rules_path=ROOT/'evaluation/rules/v1'/f'{item["prompt_id"]}.json';rules_raw=rules_path.read_bytes();rules=validate_rules(json.loads(rules_raw));frozen_rules[item['prompt_id']]=rules_raw
        prompt=(run_dir/'input/prompt.md').read_bytes()
        if sha(prompt)!=rules['prompt_sha256'] or run['prompt_sha256']!=rules['prompt_sha256'] or run['prompt_revision']!=rules['prompt_revision'] or run['prompt_id']!=rules['prompt_id'] or run['method']!=item['method']:raise ValueError('Prompt/run identity mismatch')
        metadata=json.loads((run_dir/'input/metadata.json').read_text())
        required={v['criterion_id'] for v in metadata['acceptance_criteria']};covered={v for t in rules['tests'] for v in t['source_criteria']}
        if required!=covered:raise ValueError('Acceptance-criterion coverage mismatch')
        all_inputs.update({v['path']:v['sha256'] for v in manifest})
        facts=None;parse_error=None;reader_unsupported=False
        try:
            if final:
                if item['method']=='tscircuit-codegen':facts=load_tscircuit(final)
                elif item['method']=='kicad-codegen':facts=load_kicad(final)
                else:raise UnsupportedArtifact('Unsupported method')
            else:parse_error='No retained selected candidate'
        except UnsupportedArtifact as exc:
            reader_unsupported=True;parse_error='UnsupportedArtifact: '+str(exc)
        except (ValueError,KeyError,TypeError,IndexError,ZeroDivisionError) as exc:
            parse_error=type(exc).__name__+': '+str(exc)
        checker=Checker(facts,rules,run_dir,reader_unsupported=reader_unsupported);outcomes=[]
        for test in rules['tests']:
            outcome,observed=checker.check(test['rule'])
            outcomes.append({'test_id':test['id'],'outcome':outcome,'observed':observed,'evidence':['input-manifest.json','normalized-facts.json'] if outcome in {'pass','fail'} else [],'critical':test['critical'],'category':test['category']})
        evaluation={'schema_version':'1.0.0','run_id':run['run_id'],'prompt_id':item['prompt_id'],'method':item['method'],'prompt_sha256':rules['prompt_sha256'],'rules_sha256':sha(rules_raw),'evaluator_code_sha256':code_hash,'versions':versions,'retrospective':True,'parse_error':parse_error,'outcomes':outcomes,'scores':score(rules,outcomes)}
        decisions.append((item,evaluation,facts,manifest,checker.geometry))
    expected={(p['prompt_id'],m) for p in config['prompt_revisions'] for m in config['methods']}
    if seen!=expected:raise ValueError('Incomplete prompt-method pairs')
    identity={'config_sha256':sha(config_path.read_bytes()),'inputs':all_inputs,'rules':{k:sha(v) for k,v in frozen_rules.items()},'code_sha256':code_hash,'versions':versions}
    evaluation_id='deterministic-v1-'+sha(dump(identity))[:20]
    destination=ROOT/'data/evaluations'/args.experiment_id/evaluation_id
    payload={'evaluation-manifest.json':dump({'evaluation_id':evaluation_id,**identity})}
    summary=[]
    for item,evaluation,facts,manifest,geometry in decisions:
        rel=item['prompt_id']+'/'+item['method'];evaluation['evaluation_id']=evaluation_id+'--'+item['prompt_id']+'--'+item['method']
        # Path objects belong in evidence manifests, not normalized numerical facts.
        if facts:facts={k:v for k,v in facts.items() if k!='files'}
        for name,value in [('evaluation.json',evaluation),('normalized-facts.json',facts),('input-manifest.json',manifest),('copper-audit.json',geometry)]:payload[rel+'/'+name]=dump(value)
        summary.append({'prompt_id':item['prompt_id'],'method':item['method'],**evaluation['scores']})
    for name,raw in frozen_rules.items():payload['rules/'+name+'.json']=raw
    for name,raw in sources.items():payload['evaluator-source/'+name]=raw
    summary.sort(key=lambda v:(v['prompt_id'],v['method']));payload['summary.json']=dump(summary)
    lines=['# Deterministic retrospective scoring','',f'Evaluation: `{evaluation_id}`. No model judge or generated script was executed. Raw runs were read only.','',
           'Weights: functional requirements 30%, connectivity 30%, physical constraints 20%, deliverable integrity 20%. Each category receives 0/1/2 from its explicit rule outcomes. Missing evidence makes its category and the strict total null. A known critical failure makes overall pass false.','',
           'Score ranges below are possible totals under unresolved evidence, **not awarded scores**. Marking association, component documentation, source replay and netlist-export freshness are not proved by static geometry. This retrospective audit is not a controlled method ranking.','',
           '| Prompt | Method | Strict score | Possible range | Overall pass | Resolved rules | Evidence |','| --- | --- | --- | --- | --- | --- | --- |']
    for row in summary:
        strict='unknown' if row['total_score'] is None else f'{row["total_score"]:g}'
        overall='unknown' if row['overall_pass'] is None else str(row['overall_pass']).lower()
        lines.append(f'| {row["prompt_id"]} | {row["method"]} | {strict} | {row["possible_total_min"]:g}–{row["possible_total_max"]:g} | {overall} | {row["resolved_test_count"]}/{row["applicable_test_count"]} | [Rules and decisions]({row["prompt_id"]}/{row["method"]}/evaluation.json) |')
    lines += ['', 'The full evaluator and rule bytes are archived alongside normalized facts and SHA-256 input manifests. Repeating the same command with unchanged inputs validates/reuses this directory; it never overwrites a different evaluation.']
    payload['README.md']=('\n'.join(lines)+'\n').encode()
    # Confirm the audit did not mutate any input, including failed original candidates it read.
    for path,digest in all_inputs.items():
        if sha((ROOT/path).read_bytes())!=digest:raise ValueError('Input changed during evaluation: '+path)
    if destination.exists():
        existing={str(p.relative_to(destination)):p.read_bytes() for p in destination.rglob('*') if p.is_file()}
        if existing!=payload:raise ValueError('Existing immutable evaluation differs; refusing overwrite')
        state='identical-existing-evaluation'
    else:
        destination.parent.mkdir(parents=True,exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='.scoring-',dir=destination.parent) as temp:
            staged=Path(temp)/'evaluation';staged.mkdir()
            for path,raw in payload.items():p=staged/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
            staged.rename(destination)
        state='created'
    print(json.dumps({'status':state,'runs':len(summary),'strict_scores':sum(r['total_score'] is not None for r in summary),'known_critical_failures':sum(r['critical_failure'] for r in summary),'report':str(destination/'README.md')}))


if __name__=='__main__':
    try:main()
    except (ValueError,FileNotFoundError) as exc:sys.exit(str(exc))
