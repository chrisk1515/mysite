import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { title, body } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "Missing title/body" }, { status: 400 });
  await prisma.note.create({ data: { title, body } });
  return NextResponse.json({ ok: true });
}
