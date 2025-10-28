import Link from "next/link"
export default function Home() {
  return (
    <main style={{display:"grid",gap:12}}>
      <h1>My Site</h1>
      <p><Link href="/notes">Go to Notes</Link></p>
    </main>
  )
}
