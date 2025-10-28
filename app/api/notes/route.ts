import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const { title, content } = await req.json()
  const note = await prisma.note.create({
    data: { title: String(title ?? "").slice(0, 200), body: String(content ?? "") },
  })
  return NextResponse.json(note, { status: 201 })
}
