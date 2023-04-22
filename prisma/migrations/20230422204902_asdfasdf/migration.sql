-- CreateTable
CREATE TABLE `UserRankingItemChoiceIndex` (
    `userId` VARCHAR(191) NOT NULL,
    `rankingId` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 0,

    INDEX `UserRankingItemChoiceIndex_userId_idx`(`userId`),
    INDEX `UserRankingItemChoiceIndex_rankingId_idx`(`rankingId`),
    PRIMARY KEY (`userId`, `rankingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
