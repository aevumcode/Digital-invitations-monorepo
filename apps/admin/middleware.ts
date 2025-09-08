import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { routes } from "./routes";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(routes.LOGIN, req.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(routes.LOGIN, req.url));
  }
}

export const config = {
  matcher: ["/(admin/:path*)"],
};
