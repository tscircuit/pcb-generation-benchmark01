/** Read local archives, export sanitized supplementary evidence; never execute session code. */
import { basename, join, relative } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { ROOT, walk, json, dump, sha, write } from "../src/lib/io";
import { visibleItem } from "../src/evidence/transcripts";
const EID = "2026-09-05-codegen-pilot-01";
const PARENT = "01a07291-57aa-7871-b581-0dd70239e21a";
export function recover(archive: string) {
  const configPath = join(ROOT,"configs", EID+".json"), config = json(configPath);
  const sessions = walk(archive).filter(f=>f.endsWith(".jsonl")).map(file=> {
    const bytes = readFileSync(file), lines = bytes.toString("utf8").trimEnd().split("\n");
    const rows = lines.map((line,i)=>({line:i+1, raw:line, ...JSON.parse(line)}));
    return {file, bytes, rows, meta:rows[0]?.payload};
  }).filter(s=>s.meta?.id===PARENT || s.meta?.parent_thread_id===PARENT);
  const entries = [];
  for (const [index, order] of config.execution_order.entries()) {
    const dir = `data/runs/${EID}/${order.prompt_id}/${order.method}/replicate-1`;
    const runPath = join(ROOT,dir,"run.json"), run = json(runPath);
    const parent = index >= 18;
    const candidates = sessions.filter(s=> parent ? s.meta.id===PARENT : s.meta.agent_path===`/root/pilot_${String(index+1).padStart(2,"0")}`);
    if(candidates.length>1) throw Error("Ambiguous session: "+run.run_id);
    const session = candidates[0];
    const pathCalls = session?.rows.filter(r=> /^(custom_tool_call|function_call)$/.test(r.payload?.type) && (r.payload.input??r.payload.arguments??"").includes(dir)) ?? [];
    if(session && !pathCalls.length) throw Error("No exact run-path corroboration: "+run.run_id);
    const calls = new Set(pathCalls.map(r=>r.payload.call_id));
    const selected = session?.rows.filter(r=> !parent || calls.has(r.payload?.call_id)) ?? [];
    const events = selected.flatMap(r=> {
      const item = visibleItem(r);
      return item ? [{timestamp:r.timestamp ?? null, source_line:r.line, source_line_sha256:sha(r.raw), item}] : [];
    });
    const notes = session ? [
      "Incomplete transcript: encrypted content is unavailable; hidden reasoning, system/developer instructions and runtime context are excluded.",
      "Text is credential-redacted. Binary media is represented by hashes. Original archive is not copied. No missing messages are reconstructed.",
      "Tool output may already be truncated in the source archive; retained as recorded.",
      ...(parent ? ["Parent-session excerpt: only calls explicitly containing this run directory and their matching results. Shared preparation, unbound follow-up calls and narrative messages are not attributed to this run."] : ["Readable user/assistant messages, agent messages, tool calls/results retained from the dedicated session, including repairs."]),
    ] : ["Unavailable: no original session with a verified mapping found in the supplied archive."];
    const evidence = {
      schema_version: "1", run_id:run.run_id, status:events.length ? "incomplete" : "unavailable", notes,
      provenance: {
        source:session ? {archive_file:basename(session.file), session_id:session.meta.id, parent_thread_id:session.meta.parent_thread_id??null, agent_path:session.meta.agent_path??null, sha256:sha(session.bytes), bytes:session.bytes.length} : null,
        mapping:{execution_order_index:index+1, config:{path:relative(ROOT,configPath),sha256:sha(readFileSync(configPath))},run:{path:relative(ROOT,runPath),sha256:sha(readFileSync(runPath))}, rule:parent ? "Known orchestration session plus exact run-directory calls and call-ID-linked results" : "Session parent + agent path matching frozen execution order, corroborated by exact run-directory tool calls", corroborating_source_lines:pathCalls.map(r=>r.line)},
        extractor:{path:"scripts/recover-generation-transcripts.ts",sha256:sha(readFileSync(import.meta.path)),sanitizer_sha256:sha(readFileSync(join(ROOT,"src/evidence/transcripts.ts")))},
      },
      attempts:run.attempts, events,
    };
    const bytes = dump(evidence), hash = sha(bytes), file = `${run.run_id}/${hash}.json`;
    const dest = join(ROOT,"data/supplementary",EID,"transcripts",file);
    if(existsSync(dest) && readFileSync(dest,"utf8")!==bytes) throw Error("Evidence collision");
    if(!existsSync(dest)) write(dest,bytes);
    entries.push({run_id:run.run_id,status:evidence.status,file,sha256:hash,event_count:events.length});
  }
  write(join(ROOT,"data/supplementary",EID,"transcripts/index.json"),dump({schema_version:"1",experiment_id:EID,entries}));
  console.log(entries.map(e=>`${e.run_id}: ${e.status}, ${e.event_count} events`).join("\n"));
}
if(import.meta.main){if(!process.argv[2])throw Error("Usage: bun scripts/recover-generation-transcripts.ts <local archive directory>");recover(process.argv[2]);}
