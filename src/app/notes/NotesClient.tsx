"use client";
import Link from "next/link";
import { useState } from "react";

export default function NotesClient({ initialNotes }: { initialNotes: any[] }) {
  const [notes, setNotes] = useState(initialNotes);

  async function onDelete(id: string) {
    const r = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (r.ok) setNotes(n => n.filter(x => x.id !== id));
    else alert("Delete failed");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>
      <Link className="underline" href="/new-note">New note</Link>
      <ul className="space-y-3">
        {notes.map(n => (
          <li key={n.id} className="border p-3 rounded flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">{n.title}</div>
              <div className="text-sm opacity-80 whitespace-pre-wrap break-words">{n.body}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/notes/${n.id}/edit`}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(n.id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:opacity-90"
                aria-label={`Delete ${n.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
