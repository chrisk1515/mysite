import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { __prisma?: PrismaClient };
export const prisma = g.__prisma ?? new PrismaClient();
if (!g.__prisma) g.__prisma = prisma;
export default prisma;