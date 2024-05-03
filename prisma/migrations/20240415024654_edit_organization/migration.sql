/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "clientSecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_clientId_key" ON "Organization"("clientId");
