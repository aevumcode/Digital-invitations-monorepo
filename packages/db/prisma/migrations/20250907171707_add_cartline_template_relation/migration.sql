-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CartLine" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currencyCode" TEXT NOT NULL,

    CONSTRAINT "CartLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CartLine" ADD CONSTRAINT "CartLine_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartLine" ADD CONSTRAINT "CartLine_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."InvitationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
