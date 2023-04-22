/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserRankingItemElo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rankingItemId]` on the table `UserRankingItemElo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserRankingItemElo_userId_key` ON `UserRankingItemElo`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserRankingItemElo_rankingItemId_key` ON `UserRankingItemElo`(`rankingItemId`);
