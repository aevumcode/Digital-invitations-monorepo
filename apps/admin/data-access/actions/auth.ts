"use server";

import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { verifyPassword, createToken, hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";
import { routes } from "@/routes";
import * as Yup from "yup";
import loginSchema from "@/schemas/_login";
import registerSchema from "@/schemas/_register";

// --- LOGIN ACTION ---
interface LoginRequest {
  email: string;
  password: string;
}

export async function loginAction({ email, password }: LoginRequest) {
  try {
    await loginSchema.validate({ email, password }, { abortEarly: false });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new Error("Invalid email or password");

    const token = await createToken(user.id, user.email);

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect(routes.LANDING);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      // Collect field + message from Yup
      const field = err.inner[0]?.path || "form";
      const message = err.errors[0];
      throw new Error(JSON.stringify({ field, message }));
    }
    throw err;
  }
}

// --- REGISTER ACTION ---
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function registerAction({ name, email, password, confirmPassword }: RegisterRequest) {
  try {
    await registerSchema.validate(
      { name, email, password, confirmPassword },
      { abortEarly: false },
    );

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User with this email already exists");

    const isMatch = password === confirmPassword;
    if (isMatch === false) {
      if (existing) throw new Error("Passwords do not match");
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = await createToken(user.id, user.email);

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect(routes.LANDING);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const field = err.inner[0]?.path || "form";
      const message = err.errors[0];
      throw new Error(JSON.stringify({ field, message }));
    }
    throw err;
  }
}

// LOGOUT
export async function logoutAction() {
  (await cookies()).delete("session");
  redirect(routes.LOGIN);
}
