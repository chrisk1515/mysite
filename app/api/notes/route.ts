export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

function errJson(e: unknown, status = 500) {
  const any = e as any;
  return NextResponse.json({ ok:false, error: String(any?.message ?? any) }, { status });
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(notes);
  } catch (e) {
    console.error("GET /api/notes failed:", e);
    return errJson(e);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({} as any));
    const title = (data.title ?? "").toString().trim();
    const body  = (data.body ?? data.content ?? "").toString();
    if (!title) return errJson(new Error("title required"), 400);
    const note = await prisma.note.create({ data: { title, body } });
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    console.error("POST /api/notes failed:", e);
    return errJson(e);
  }
}