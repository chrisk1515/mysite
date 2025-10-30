export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// fallback if params is missing or weird
function getIdFromUrl(req: Request): string | null {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  // /api/notes/<id>
  const last = parts[parts.length - 1];
  if (!last || last === "notes") return null;
  return last;
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id?: string }> }) {
  try {
    // ?? this was the problem ? params is a Promise in your Next.js
    const resolved = await ctx.params;
    const fromParams = resolved?.id;
    const fromUrl = getIdFromUrl(req);
    const id = fromParams ?? fromUrl;

    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }

    // safe delete
    const result = await prisma.note.deleteMany({
      where: { id }
    });

    return NextResponse.json({ ok: true, id, deleted: result.count });
  } catch (e: any) {
    console.error("DELETE /api/notes/[id] failed:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}