/*
  Warnings:

  - Added the required column `userId` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ranking` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Ranking_userId_idx` ON `Ranking`(`userId`);
