-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PAID', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('DRAFT', 'READY', 'SENT');

-- CreateEnum
CREATE TYPE "public"."DeliveryChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "public"."BatchStatus" AS ENUM ('QUEUED', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('SENT', 'FAILED', 'OPENED');

-- CreateEnum
CREATE TYPE "public"."RsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvitationTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schemaJson" JSONB NOT NULL,
    "previewUrl" TEXT NOT NULL,

    CONSTRAINT "InvitationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "stripeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvitationProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "configJson" JSONB NOT NULL,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "InvitationProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitee" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "tag" TEXT,
    "token" TEXT NOT NULL,
    "rsvpStatus" "public"."RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "invitationUrl" TEXT NOT NULL,

    CONSTRAINT "Invitee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvitationBatch" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "channel" "public"."DeliveryChannel" NOT NULL,
    "scheduleAt" TIMESTAMP(3),
    "status" "public"."BatchStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvitationEvent" (
    "id" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "channel" "public"."DeliveryChannel" NOT NULL,
    "status" "public"."DeliveryStatus" NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationTemplate_slug_key" ON "public"."InvitationTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeId_key" ON "public"."Order"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitee_token_key" ON "public"."Invitee"("token");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."InvitationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvitationProject" ADD CONSTRAINT "InvitationProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvitationProject" ADD CONSTRAINT "InvitationProject_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."InvitationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitee" ADD CONSTRAINT "Invitee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."InvitationProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvitationBatch" ADD CONSTRAINT "InvitationBatch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."InvitationProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvitationEvent" ADD CONSTRAINT "InvitationEvent_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "public"."Invitee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
