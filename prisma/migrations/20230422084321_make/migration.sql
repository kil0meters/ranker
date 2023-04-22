/*
  Warnings:

  - You are about to drop the column `globalElo` on the `RankingItem` table. All the data in the column will be lost.
  - You are about to drop the `RankingItemInstance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rankingId` to the `RankingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RankingItem` DROP COLUMN `globalElo`,
    ADD COLUMN `elo` INTEGER NOT NULL DEFAULT 1000,
    ADD COLUMN `rankingId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `RankingItemInstance`;

-- CreateIndex
CREATE INDEX `RankingItem_rankingId_idx` ON `RankingItem`(`rankingId`);
