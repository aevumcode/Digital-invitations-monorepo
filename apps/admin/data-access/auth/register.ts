"use server";

import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { hashPassword, createToken } from "@/lib/auth";
import registerSchema from "@/schemas/_register";
import * as Yup from "yup";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerAction(values: RegisterInput) {
  try {
    await registerSchema.validate(values, { abortEarly: false });

    const { name, email, password } = values;

    if (!email || !password) {
      return { success: false, error: "Missing fields" };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = await createToken(user.id, user.email);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return { success: false, error: err.errors[0] };
    }

    console.error("Register error:", err);
    return { success: false, error: "Server error" };
  }
}
