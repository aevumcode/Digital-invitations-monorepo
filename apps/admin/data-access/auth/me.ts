"use server";
import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { verifyToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    if (!payload?.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, name: true },
    });

    return user;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
