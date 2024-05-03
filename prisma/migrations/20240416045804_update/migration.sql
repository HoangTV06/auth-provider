/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnOrganization` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganization" DROP CONSTRAINT "UsersOnOrganization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganization" DROP CONSTRAINT "UsersOnOrganization_userId_fkey";

-- AlterTable
ALTER TABLE "AuthorizationCode" ALTER COLUMN "redirectUri" DROP NOT NULL,
ALTER COLUMN "scope" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "organizationId",
ADD COLUMN     "grants" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "scopes" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "UsersOnOrganization";
