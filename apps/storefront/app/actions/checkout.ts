"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

interface TemplatePriceItem {
  price: number;
  quantity: number;
}

// price_1S7JeEENP7teUdDtqIIz84ac
// price_1S7IzoENP7teUdDt7kor6Qvt

export async function createCheckoutSession(
  templatePriceItem: TemplatePriceItem[],
): Promise<string> {
  if (!templatePriceItem || templatePriceItem.length === 0) {
    throw new Error("Morate poslati barem jedan proizvod.");
  }

  const stripeLineItems = templatePriceItem.map((item) => ({
    price_data: {
      currency: "eur",
      unit_amount: item.price * item.quantity,
      product_data: {
        name: `Template 1`,
        description: `${item.quantity} osoba — cijena po osobi: 0,50 €`,
      },
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeLineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
    locale: "hr",
  });

  return session.url!;
}
