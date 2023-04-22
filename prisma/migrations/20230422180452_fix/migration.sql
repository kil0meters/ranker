/*
  Warnings:

  - A unique constraint covering the columns `[userId,rankingItemId]` on the table `UserRankingItemElo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `UserRankingItemElo_rankingItemId_key` ON `UserRankingItemElo`;

-- DropIndex
DROP INDEX `UserRankingItemElo_userId_key` ON `UserRankingItemElo`;

-- CreateIndex
CREATE UNIQUE INDEX `UserRankingItemElo_userId_rankingItemId_key` ON `UserRankingItemElo`(`userId`, `rankingItemId`);
