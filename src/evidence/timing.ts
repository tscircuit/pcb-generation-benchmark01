/** Presentation-only timing. Never fills or writes historical usage fields. */
function timestampNanoseconds(value: unknown): bigint | null {
  if (typeof value !== "string") return null;
  const m =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.(\d{1,9}))?(Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  if (!m) return null;
  const [hour, minute, second] = m[2].split(":").map(Number);
  if (hour > 23 || minute > 59 || second > 59) return null;
  const day = new Date(m[1] + "T00:00:00Z");
  if (
    !Number.isFinite(day.getTime()) ||
    day.toISOString().slice(0, 10) !== m[1]
  )
    return null;
  const base = Date.parse(`${m[1]}T${m[2]}${m[4]}`);
  return Number.isFinite(base)
    ? BigInt(base) * 1000000n + BigInt((m[3] ?? "").padEnd(9, "0"))
    : null;
}
const seconds = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
export function runTiming(run: any) {
  const recorded = seconds(run.usage?.wall_time_seconds);
  const start = timestampNanoseconds(run.started_at),
    end = timestampNanoseconds(run.ended_at);
  return {
    recorded_total_seconds: recorded,
    derived_total_seconds:
      run.usage?.wall_time_seconds == null &&
      start !== null &&
      end !== null &&
      end >= start
        ? Number(end - start) / 1e9
        : null,
    generation_only_seconds: seconds(run.usage?.generation_only_seconds),
    started_at: run.started_at ?? null,
    ended_at: run.ended_at ?? null,
    recorded_source: "run.json#/usage/wall_time_seconds",
    derived_source: "run.json: ended_at minus started_at; presentation only",
    generation_only_source:
      "run.json#/usage/generation_only_seconds (explicit measurement only)",
  };
}
