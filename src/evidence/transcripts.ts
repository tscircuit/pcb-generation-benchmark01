import { sha } from "../lib/io";
/** Only visible response items are exported, never reasoning or runtime context. */
export function redactText(text: string): string {
  return text
    .replace(/gAAAA[A-Za-z0-9_=-]+/g, "[unavailable: encrypted content]")
    .replace(
      /-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,
      "[redacted private key]",
    )
    .replace(
      /\b(?:sk-(?:proj-)?|gh[pousr]_|github_pat_|xox[baprs]-)[A-Za-z0-9_-]{12,}/g,
      "[redacted credential]",
    )
    .replace(
      /\b(Bearer|Basic)\s+[A-Za-z0-9+/_.=-]+/gi,
      "$1 [redacted credential]",
    )
    .replace(/(https?:\/\/)[^\s/@:]+:[^\s/@]+@/gi, "$1[redacted credential]@")
    .replace(
      /((?:api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|authorization)\s*["']?\s*[:=]\s*["']?)([^\s"',;}]+)/gi,
      "$1[redacted credential]",
    );
}
function clean(value: any): any {
  if (typeof value === "string") return redactText(value);
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") return value;
  if (value.type === "encrypted_content")
    return { type: "unavailable", reason: "encrypted content" };
  if (/image|audio/.test(value.type ?? ""))
    return {
      type: "omitted_media",
      sha256: sha(JSON.stringify(value)),
      reason:
        "Binary media omitted; original design artifacts retained separately",
    };
  return Object.fromEntries(
    Object.entries(value)
      .filter(([k]) => !/reasoning|encrypted|internal_chat|metadata/i.test(k))
      .map(([k, v]) => [
        k,
        /^(api_key|token|password|secret|authorization)$/i.test(k)
          ? "[redacted credential]"
          : clean(v),
      ]),
  );
}
export function visibleItem(row: any): any | null {
  if (row.type !== "response_item") return null;
  const p = row.payload;
  if (p.channel === "analysis" || p.phase === "analysis") return null;
  let keys: string[];
  if (p.type === "message" && ["user", "assistant"].includes(p.role))
    keys = ["type", "role", "content", "phase"];
  else if (p.type === "agent_message")
    keys = ["type", "author", "recipient", "content"];
  else if (["function_call", "custom_tool_call"].includes(p.type))
    keys = [
      "type",
      "name",
      "namespace",
      "call_id",
      "arguments",
      "input",
      "status",
    ];
  else if (["function_call_output", "custom_tool_call_output"].includes(p.type))
    keys = ["type", "call_id", "output"];
  else return null;
  return clean(
    Object.fromEntries(
      keys.filter((k) => p[k] !== undefined).map((k) => [k, p[k]]),
    ),
  );
}
