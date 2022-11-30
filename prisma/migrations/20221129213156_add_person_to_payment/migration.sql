/*
  Warnings:

  - Added the required column `person` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "description" TEXT,
    "firstRoad" TEXT,
    "secondRoad" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Resident" ("active", "address", "age", "createdAt", "description", "firstRoad", "gender", "id", "name", "phone", "secondRoad", "updatedAt") SELECT "active", "address", "age", "createdAt", "description", "firstRoad", "gender", "id", "name", "phone", "secondRoad", "updatedAt" FROM "Resident";
DROP TABLE "Resident";
ALTER TABLE "new_Resident" RENAME TO "Resident";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "person" TEXT NOT NULL
);
INSERT INTO "new_Payment" ("amount", "createdAt", "dueDate", "id", "type", "updatedAt") SELECT "amount", "createdAt", "dueDate", "id", "type", "updatedAt" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
