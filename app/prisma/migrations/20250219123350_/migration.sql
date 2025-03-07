/*
  Warnings:

  - Added the required column `emailHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "emailHash" TEXT NOT NULL,
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
