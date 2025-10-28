async function load() {
  try {
    const res = await fetch("/api/notes", { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) throw new Error("Non-JSON from /api/notes");
    const data = JSON.parse(text);
    setNotes(Array.isArray(data) ? data : []);
    setErr(null);
  } catch (e:any) {
    setErr(e.message || String(e));
  }
}
