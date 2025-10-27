import Link from "next/link";
export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Home</h1>
      <p><Link href="/notes">Go to Notes</Link></p>
    </main>
  );
}
