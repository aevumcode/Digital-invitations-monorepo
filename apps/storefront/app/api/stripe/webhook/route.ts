import { prisma } from "@digital-inv/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
  console.log("✅ Received event:", event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = Number(session.metadata?.userId);
    const items = JSON.parse(session.metadata?.items || "[]");
    for (const item of items) {
      await prisma.userTemplate.create({
        data: {
          userId,
          templateId: item.id,
          price: Math.round(item.price),
          quantity: item.quantity,
          customData: {},
        },
      });
    }
    console.log("💾 Saved templates for user:", userId);
  }
  return NextResponse.json({ received: true });
}
