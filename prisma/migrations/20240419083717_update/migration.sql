/*
  Warnings:

  - You are about to drop the column `redirectUris` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiresAt` on the `Token` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redirectUri` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropIndex
DROP INDEX "Token_refreshToken_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "redirectUris",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "redirectUri" TEXT NOT NULL,
ADD COLUMN     "scopes" TEXT[];

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiresAt",
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "AuthorizationCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "scope" TEXT,
    "redirectUri" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorizationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationCode_code_key" ON "AuthorizationCode"("code");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationCode" ADD CONSTRAINT "AuthorizationCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationCode" ADD CONSTRAINT "AuthorizationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
