"use client";

import { ArrowRight, PlusCircleIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
// import { Loader } from "../ui/loader";
import { CartItemCard } from "./cart-item";
import { formatPrice } from "@/lib/shopify/utils";
import { useBodyScrollLock } from "@/lib/hooks/use-body-scroll-lock";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cart } from "../../lib/shopify/types";
import { createCheckoutSession, TemplatePriceItem } from "@/app/actions/checkout";

const CartContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("px-3 md:px-4", className)}>{children}</div>;

const CartItems = ({ closeCart }: { closeCart: () => void }) => {
  const { cart } = useCart();
  if (!cart) return null;

  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <CartContainer className="flex justify-between px-2 text-sm text-muted-foreground">
        <span>Products</span>
        <span>{cart.lines.length} items</span>
      </CartContainer>
      <div className="relative flex-1 min-h-0 py-4 overflow-x-hidden">
        <CartContainer className="overflow-y-auto flex flex-col gap-y-3 h-full scrollbar-hide">
          <AnimatePresence>
            {cart.lines.map((item, i) => (
              <motion.div
                key={item.merchandise.id}
                layout
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
              >
                <CartItemCard item={item} onCloseCart={closeCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </CartContainer>
      </div>
      <CartContainer>
        <div className="py-4 text-sm text-foreground/50 shrink-0">
          <div className="flex justify-between items-center pb-1 mb-3 border-b border-muted-foreground/20">
            <p>Taxes</p>
            <p className="text-right">Calculated at checkout</p>
          </div>
          <div className="flex justify-between items-center pt-1 pb-1 mb-3 border-b border-muted-foreground/20">
            <p>Shipping</p>
            <p className="text-right">Calculated at checkout</p>
          </div>
          <div className="flex justify-between items-center pt-1 pb-1 mb-1.5 text-lg font-semibold">
            <p>Total</p>
            <p className="text-base text-right text-foreground">
              {formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
            </p>
          </div>
        </div>
        <CheckoutButton />
      </CartContainer>
    </div>
  );
};

const serializeCart = (cart: Cart) =>
  JSON.stringify(
    cart.lines.map((l) => ({ merchandiseId: l.merchandise.id, quantity: l.quantity })),
  );

export default function CartModal({ url }: { url?: string }) {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const serializedCart = useRef<string | undefined>(cart ? serializeCart(cart) : undefined);
  const hiddenOnRoutes = ["/auth/login", "/auth/register"];

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!cart) return;
    const next = serializeCart(cart);

    if (serializedCart.current === undefined) {
      serializedCart.current = next;
      return;
    }
    if (serializedCart.current !== next) {
      serializedCart.current = next;
      setIsOpen(true);
    }
  }, [cart]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    if (isOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen]);

  if (url && hiddenOnRoutes.includes(url)) return null;

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const renderCartContent = () => {
    if (!cart || cart.lines.length === 0) {
      return (
        <CartContainer className="flex w-full">
          <Link
            href="/shop"
            className="p-2 w-full rounded-lg border border-dashed bg-background border-border"
            onClick={closeCart}
          >
            <div className="flex flex-row gap-6">
              <div className="flex overflow-hidden relative justify-center items-center rounded-sm border border-dashed size-20 shrink-0 border-border">
                <PlusCircleIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col flex-1 gap-2 justify-center 2xl:gap-3">
                <span className="text-lg font-semibold 2xl:text-xl">Cart is empty</span>
                <p className="text-sm text-muted-foreground hover:underline">
                  Start shopping to get started
                </p>
              </div>
            </div>
          </Link>
        </CartContainer>
      );
    }
    return <CartItems closeCart={closeCart} />;
  };

  return (
    <>
      <Button aria-label="Open cart" onClick={openCart} className="uppercase" size="sm">
        <span className="max-md:hidden">cart</span> ({cart?.lines.length || 0})
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-foreground/30"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 bottom-0 right-0 flex w-full md:w-[500px] p-modal-sides z-50"
            >
              <div className="flex flex-col py-3 w-full rounded bg-muted md:py-4">
                <CartContainer className="flex justify-between items-baseline mb-10">
                  <p className="text-2xl font-semibold">Cart</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Close cart"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </CartContainer>

                {renderCartContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function CheckoutButton() {
  const { cart } = useCart();
  const canCheckout = !!cart && cart.totalQuantity > 0;

  const handleClick = async () => {
    try {
      const carts = cart?.lines.map((line) => ({
        price: +line.cost.totalAmount.amount,
        quantity: line.quantity,
        id: line.merchandise.product.id,
      })) as TemplatePriceItem[];

      const stripeUrl = await createCheckoutSession(carts || []);
      window.location.href = stripeUrl;
    } catch (err: any) {
      if (err.message === "NOT_AUTHENTICATED") {
        window.location.href = `/auth/login?redirect=/checkout`;
      } else {
        console.error("Checkout error:", err);
      }
    }
  };

  return (
    <Button
      disabled={!canCheckout}
      size="lg"
      className="flex relative gap-3 justify-between items-center w-full"
      onClick={handleClick}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex justify-between items-center w-full"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="size-6" />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
