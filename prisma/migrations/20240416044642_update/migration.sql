/*
  Warnings:

  - Added the required column `scope` to the `AuthorizationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthorizationCode" ADD COLUMN     "scope" TEXT NOT NULL;
