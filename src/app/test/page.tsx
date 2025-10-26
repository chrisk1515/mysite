"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Test Page ✅</h1>
        <p>Client counter: <span className="font-mono">{count}</span></p>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Increment
        </button>
        <p className="text-sm opacity-70">
          Try visiting <code>/api/ping</code> in a new tab too.
        </p>
      </div>
    </main>
  );
}