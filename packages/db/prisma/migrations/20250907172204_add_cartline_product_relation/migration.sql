/*
  Warnings:

  - You are about to drop the column `templateId` on the `CartLine` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CartLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `CartLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CartLine" DROP CONSTRAINT "CartLine_templateId_fkey";

-- AlterTable
ALTER TABLE "public"."CartLine" DROP COLUMN "templateId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CartLine" ADD CONSTRAINT "CartLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."InvitationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
