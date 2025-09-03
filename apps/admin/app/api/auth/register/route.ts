import { NextResponse } from "next/server";
import { prisma } from "@digital-inv/db";
import { hashPassword, createToken } from "@/lib/auth";
import registerSchema from "@/schemas/_register";
import * as Yup from "yup";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    try {
      await registerSchema.validate(body, { abortEarly: false });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errField = err?.inner[0]?.path || ("" as string);
        const errMess = err.errors[0];

        throw new Error(JSON.stringify({ errField, errMess }));
      }
    }

    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = await createToken(user.id, user.email);

    const res = NextResponse.json({ user: { id: user.id, email: user.email } });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
