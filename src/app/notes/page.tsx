import Link from "next/link";

async function getNotes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/notes`, { cache: "no-store" });
  return res.json();
}

export default async function NotesPage() {
  const notes = await getNotes();
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>
      <Link className="underline" href="/new-note">New note</Link>
      <ul className="space-y-3">
        {notes.map((n: any) => (
          <li key={n.id} className="border p-3 rounded">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm opacity-80 whitespace-pre-wrap">{n.body}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}