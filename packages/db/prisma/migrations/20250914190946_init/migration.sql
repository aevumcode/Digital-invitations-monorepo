/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartLine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvitationBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvitationEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvitationProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvitationTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CartLine" DROP CONSTRAINT "CartLine_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartLine" DROP CONSTRAINT "CartLine_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvitationBatch" DROP CONSTRAINT "InvitationBatch_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvitationEvent" DROP CONSTRAINT "InvitationEvent_inviteeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvitationProject" DROP CONSTRAINT "InvitationProject_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvitationProject" DROP CONSTRAINT "InvitationProject_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvitationTemplate" DROP CONSTRAINT "InvitationTemplate_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitee" DROP CONSTRAINT "Invitee_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "isActive",
DROP COLUMN "lastLogin",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Cart";

-- DropTable
DROP TABLE "public"."CartLine";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."InvitationBatch";

-- DropTable
DROP TABLE "public"."InvitationEvent";

-- DropTable
DROP TABLE "public"."InvitationProject";

-- DropTable
DROP TABLE "public"."InvitationTemplate";

-- DropTable
DROP TABLE "public"."Invitee";

-- DropTable
DROP TABLE "public"."Order";

-- DropEnum
DROP TYPE "public"."BatchStatus";

-- DropEnum
DROP TYPE "public"."DeliveryChannel";

-- DropEnum
DROP TYPE "public"."DeliveryStatus";

-- DropEnum
DROP TYPE "public"."Gender";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."ProjectStatus";

-- DropEnum
DROP TYPE "public"."RsvpStatus";

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "fullPrice" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserTemplate" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customData" JSONB NOT NULL,

    CONSTRAINT "UserTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" SERIAL NOT NULL,
    "userTemplateId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "totalGuests" INTEGER NOT NULL DEFAULT 1,
    "isAttending" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserTemplate" ADD CONSTRAINT "UserTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTemplate" ADD CONSTRAINT "UserTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_userTemplateId_fkey" FOREIGN KEY ("userTemplateId") REFERENCES "public"."UserTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guest" ADD CONSTRAINT "Guest_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
