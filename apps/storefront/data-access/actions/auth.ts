"use server";

import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { verifyPassword, createToken, hashPassword } from "@/lib/auth";
import * as Yup from "yup";
import loginSchema from "@/schemas/_login";
import { createCheckoutSession } from "@/app/actions/checkout";
import type { Cart } from "@/lib/shopify/types";
import { redirect } from "next/navigation";
import { routes } from "@/routes";
import { registerSchema as registerBackendSchema } from "@/schemas/_register";

interface LoginRequest {
  email: string;
  password: string;
  redirectTo?: string;
  cart?: Cart;
}

export async function loginAction({ email, password, redirectTo, cart }: LoginRequest) {
  try {
    await loginSchema.validate({ email, password }, { abortEarly: false });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new Error("Invalid email or password");

    const token = await createToken(user.id.toString(), user.email);

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    let checkoutUrl: string | null = null;
    if (redirectTo === "/checkout" && cart?.lines?.length) {
      checkoutUrl = await createCheckoutSession(
        cart.lines.map((line) => ({
          price: 50,
          quantity: line.quantity,
          name: line.merchandise.product.title,
          id: line.merchandise.product.id,
        })),
      );
    }

    return { user, checkoutUrl };
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const field = err.inner[0]?.path || "form";
      const message = err.errors[0];
      throw new Error(JSON.stringify({ field, message }));
    }
    throw err;
  }
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  redirectTo?: string;
  cart?: Cart;
}

export async function registerAction({ name, email, password, redirectTo, cart }: RegisterRequest) {
  try {
    await registerBackendSchema.validate({ name, email, password }, { abortEarly: false });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User with this email already exists");

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = await createToken(user.id.toString(), user.email);

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    let checkoutUrl: string | null = null;
    if (redirectTo === "/checkout" && cart?.lines?.length) {
      checkoutUrl = await createCheckoutSession(
        cart.lines.map((line) => ({
          price: 50,
          quantity: line.quantity,
          name: line.merchandise.product.title,
          id: line.merchandise.product.id,
        })),
      );
    }

    return { user, checkoutUrl };
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
