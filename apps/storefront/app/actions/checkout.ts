"use server";

import Stripe from "stripe";
import { getSession } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

function getAppUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  return `${baseUrl}${path}`;
}

export interface TemplatePriceItem {
  price: number;
  quantity: number;
  id: number;
}

export async function createCheckoutSession(templatePriceItem: TemplatePriceItem[]) {
  const session = await getSession();
  console.log("User session:", session);

  if (!session) {
    throw new Error("NOT_AUTHENTICATED");
  }

  if (!templatePriceItem || templatePriceItem.length === 0) {
    throw new Error("Morate poslati barem jedan proizvod.");
  }

  console.log("Creating checkout session for:", templatePriceItem);

  const stripeLineItems = templatePriceItem.map((item) => ({
    price_data: {
      currency: "eur",
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: "Template 1",
        description: `${item.quantity} osoba — cijena po osobi: 0,50 €`,
      },
    },
    quantity: 1,
  }));

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeLineItems,
    mode: "payment",
    success_url: getAppUrl("/success"),
    cancel_url: getAppUrl("/cancel"),
    locale: "hr",
    customer_email: session.email,
    metadata: {
      userId: session.id,
      items: JSON.stringify(templatePriceItem),
    },
  });

  return checkoutSession.url!;
}
