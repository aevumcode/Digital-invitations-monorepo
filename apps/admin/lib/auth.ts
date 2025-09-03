import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

import type { JwtPayload } from "@/types/_auth";

// Helper: convert secret into Uint8Array
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in .env");
  return new TextEncoder().encode(secret);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

// Create JWT
export async function createToken(userId: string, email: string) {
  return await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

// Verify JWT
export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    const typed = payload as unknown as JwtPayload;

    if (!typed.sub || !typed.email) {
      throw new Error("Invalid token payload");
    }

    return typed;
  } catch (e) {
    throw new Error("Invalid token");
  }
}
