/*
  Warnings:

  - You are about to drop the column `emailHash` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EmailHash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatarUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "authProvider" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("authProvider", "avatarUrl", "createdAt", "email", "id", "name", "passwordHash", "updatedAt", "verified") SELECT "authProvider", "avatarUrl", "createdAt", "email", "id", "name", "passwordHash", "updatedAt", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_authProvider_idx" ON "User"("authProvider");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EmailHash_email_key" ON "EmailHash"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailHash_hash_key" ON "EmailHash"("hash");
