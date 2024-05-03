/*
  Warnings:

  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "UsersOnOrganization" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "UsersOnOrganization_pkey" PRIMARY KEY ("userId","organizationId")
);

-- AddForeignKey
ALTER TABLE "UsersOnOrganization" ADD CONSTRAINT "UsersOnOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnOrganization" ADD CONSTRAINT "UsersOnOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
