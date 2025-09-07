"use server";

import { prisma } from "@/../../packages/db/src/index";
import { cookies } from "next/headers";
import type { Cart, CartItem } from "@/lib/shopify/types";

// --- Utility: adapt Prisma Cart → FE Cart
function adaptCart(dbCart: any): Cart {
  const lines: CartItem[] = dbCart.lines.map((line: any) => ({
    id: line.id,
    quantity: line.quantity,
    cost: {
      totalAmount: {
        amount: ((line.priceCents * line.quantity) / 100).toString(),
        currencyCode: line.currencyCode,
      },
    },
    merchandise: {
      id: line.variantId,
      title: line.template.name,
      selectedOptions: [], // if you later add variant options
      product: {
        id: line.template.id,
        title: line.template.name,
        handle: line.template.slug,
        categoryId: line.template.categoryId || undefined,
        description: line.template.schemaJson?.description || "",
        descriptionHtml: "",
        featuredImage: {
          url: line.template.previewUrl,
          altText: line.template.name,
          height: 600,
          width: 600,
        },
        currencyCode: line.currencyCode,
        priceRange: {
          minVariantPrice: {
            amount: (line.priceCents / 100).toFixed(2),
            currencyCode: line.currencyCode,
          },
          maxVariantPrice: {
            amount: (line.priceCents / 100).toFixed(2),
            currencyCode: line.currencyCode,
          },
        },
        compareAtPrice: undefined,
        seo: { title: line.template.name, description: "" },
        options: [],
        tags: [],
        variants: [],
        images: [
          {
            url: line.template.previewUrl,
            altText: line.template.name,
            height: 600,
            width: 600,
          },
        ],
        availableForSale: true,
      },
    },
  }));

  return {
    id: dbCart.id,
    checkoutUrl: `/checkout/${dbCart.id}`, // or build your own checkout route
    cost: {
      subtotalAmount: {
        amount: lines.reduce((sum, l) => sum + parseFloat(l.cost.totalAmount.amount), 0).toString(),
        currencyCode: lines[0]?.cost.totalAmount.currencyCode || "USD",
      },
      totalAmount: {
        amount: lines.reduce((sum, l) => sum + parseFloat(l.cost.totalAmount.amount), 0).toString(),
        currencyCode: lines[0]?.cost.totalAmount.currencyCode || "USD",
      },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    lines,
  };
}

// --- Helpers
async function getOrCreateCartId(): Promise<string> {
  let cartId = (await cookies()).get("cartId")?.value;

  if (cartId) {
    // check if cart actually exists in DB
    const exists = await prisma.cart.findUnique({ where: { id: cartId } });
    if (exists) return cartId;
  }

  // otherwise create new cart
  const newCart = await prisma.cart.create({ data: {} });
  cartId = newCart.id;

  (await cookies()).set("cartId", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cartId;
}

// --- Actions
export async function addItem(
  productId: string,
  variantId?: string,
  priceCents?: number,
  currencyCode = "USD",
): Promise<Cart | null> {
  try {
    const cartId = await getOrCreateCartId();

    // 👇 Ensure variantId always has a value
    const safeVariantId = variantId || productId;

    // 👇 Ensure priceCents always has a value
    const safePriceCents = priceCents ?? 0;

    const existingLine = await prisma.cartLine.findFirst({
      where: { cartId, productId, variantId: safeVariantId },
    });

    if (existingLine) {
      await prisma.cartLine.update({
        where: { id: existingLine.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      await prisma.cartLine.create({
        data: {
          cartId,
          productId,
          variantId: safeVariantId, // ✅ guaranteed not undefined
          quantity: 1,
          priceCents: safePriceCents, // ✅ guaranteed not undefined
          currencyCode,
        },
      });
    }

    const fresh = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { lines: { include: { template: true } } },
    });

    return fresh ? adaptCart(fresh) : null;
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
}

export async function updateItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get("cartId")?.value;
    if (!cartId) return null;

    if (quantity === 0) {
      await prisma.cartLine.delete({ where: { id: lineId } });
    } else {
      await prisma.cartLine.update({ where: { id: lineId }, data: { quantity } });
    }

    const fresh = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { lines: { include: { template: true } } },
    });

    return fresh ? adaptCart(fresh) : null;
  } catch (error) {
    console.error("Error updating item:", error);
    return null;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get("cartId")?.value;
    if (!cartId) return null;

    const fresh = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { lines: { include: { template: true } } },
    });

    return fresh ? adaptCart(fresh) : null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function createCartAndSetCookie() {
  try {
    const newCart = await prisma.cart.create({ data: {} });

    (await cookies()).set("cartId", newCart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return newCart;
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}
