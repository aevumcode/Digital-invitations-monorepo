/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `InvitationProject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicSlug]` on the table `InvitationProject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `InvitationProject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."InvitationProject_userId_key";

-- AlterTable
ALTER TABLE "public"."InvitationProject" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicSlug" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InvitationProject_slug_key" ON "public"."InvitationProject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationProject_publicSlug_key" ON "public"."InvitationProject"("publicSlug");
