// src/app/api/db-health/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Ensure Node runtime (Prisma needs Node, not Edge)
export const runtime = "nodejs";

// Never cache health checks
export const dynamic = "force-dynamic"; // or: export const revalidate = 0;

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    // Fast DB round-trip (works on Postgres/MySQL/SQLite)
    await prisma.$executeRaw`SELECT 1`;
    return NextResponse.json(
      {
        ok: true,
        service: "database",
        status: "up",
        now: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    console.error("DB health failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
