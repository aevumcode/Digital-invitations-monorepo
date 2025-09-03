import type { JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  sub: string; // userId
  email: string;
  role: "ADMIN" | "CUSTOMER";
  name?: string;
  iat: number;
  exp: number;
}
