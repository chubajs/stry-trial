-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL
);
INSERT INTO "new_Story" ("content", "createdAt", "id", "model", "number", "prompt", "title") SELECT "content", "createdAt", "id", "model", "number", "prompt", "title" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_number_key" ON "Story"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
