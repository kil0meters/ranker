/*
  Warnings:

  - You are about to drop the column `elo` on the `RankingItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RankingItem` DROP COLUMN `elo`;

-- CreateTable
CREATE TABLE `UserRankingItemElo` (
    `userId` VARCHAR(191) NOT NULL,
    `rankingItemId` VARCHAR(191) NOT NULL,
    `elo` INTEGER NOT NULL,

    INDEX `UserRankingItemElo_userId_idx`(`userId`),
    INDEX `UserRankingItemElo_rankingItemId_idx`(`rankingItemId`),
    PRIMARY KEY (`userId`, `rankingItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
