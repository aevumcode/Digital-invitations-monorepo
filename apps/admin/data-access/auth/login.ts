"use server";

import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { verifyPassword, createToken } from "@/lib/auth";
import * as Yup from "yup";
import loginSchema from "@/schemas/_login";

type LoginResult =
  | { success: true; user: { id: string; email: string } }
  | { success: false; error: string; field?: string };

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  try {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errField = err?.inner[0]?.path || "";
        const errMess = err.errors[0];
        return { success: false, error: errMess, field: errField };
      }
    }

    const { email, password } = formData;

    // ✅ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    // ✅ Verify password
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return { success: false, error: "Invalid credentials" };
    }

    // ✅ Create JWT
    const token = await createToken(user.id, user.email);

    // ✅ Set cookie using Next.js cookies API
    const cookieStore = cookies();
    (await cookieStore).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "Server error" };
  }
}
