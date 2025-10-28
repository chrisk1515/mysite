"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type Note = { id: string, title: string, body: string, createdAt: string }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [busyId, setBusyId] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string| null>(null)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/notes", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load notes")
      setNotes(await res.json())
      setErr(null)
    } catch (e:any) {
      setErr(e?.message ?? "Load failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createNote(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: body }),
    })
    if (!res.ok) return alert("Create failed")
    setTitle(""); setBody("")
    load()
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this note?")) return
    setBusyId(id)
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    setBusyId(null)
    if (res.ok) setNotes(prev => prev.filter(n => n.id !== id))
    else alert("Delete failed")
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>
  if (err) return <main style={{ padding: 24, color: "crimson" }}>Error: {err}</main>

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
        <h1>Notes</h1>
        <Link href="/" style={{ opacity: 0.8 }}>Home</Link>
      </div>

      <form onSubmit={createNote} style={{ display:"grid", gap:8, maxWidth:520 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required
               style={{ padding:8, border:"1px solid #ddd", borderRadius:6 }} />
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="Body"
                  style={{ padding:8, border:"1px solid #ddd", borderRadius:6 }} />
        <button type="submit" style={{ padding:8, border:"1px solid #999", borderRadius:6 }}>Create</button>
      </form>

      <ul style={{ display:"grid", gap:12, listStyle:"none", padding:0 }}>
        {notes.map(n => (
          <li key={n.id} style={{ border:"1px solid #ddd", borderRadius:8, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
              <div>
                <div style={{ fontWeight:600 }}>{n.title}</div>
                {n.body && <div style={{ whiteSpace:"pre-wrap", marginTop:4 }}>{n.body}</div>}
                <div style={{ fontSize:12, opacity:0.6, marginTop:6 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <button onClick={()=>onDelete(n.id)} disabled={busyId===n.id}
                      style={{ padding:"6px 10px", border:"1px solid #999", borderRadius:6 }}>
                {busyId===n.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
