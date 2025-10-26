export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>It works ✅</h1>
      <p>Server time: {new Date().toLocaleString()}</p>
      <ul>
        <li><a href="/api/ping">/api/ping</a></li>
        <li><a href="/api/db-health">/api/db-health</a></li>
        <li><a href="/notes">/notes</a></li>
      </ul>
    </main>
  );
}
