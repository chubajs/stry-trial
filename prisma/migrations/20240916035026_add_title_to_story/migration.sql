-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL
);
INSERT INTO "new_Story" ("id", "content", "prompt", "model", "createdAt", "number")
SELECT "id", "content", "prompt", "model", "createdAt", "number"
FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_number_key" ON "Story"("number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- UpdateData
UPDATE "Story" SET "title" = substr("content", 1, 50) || '...';