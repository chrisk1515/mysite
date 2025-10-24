export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 rounded bg-black text-white">
      {children}
    </button>
  );
}
