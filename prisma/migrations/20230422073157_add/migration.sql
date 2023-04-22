-- CreateTable
CREATE TABLE `Ranking` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `popularity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ranking_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RankingItem` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `globalElo` INTEGER NOT NULL,

    UNIQUE INDEX `RankingItem_id_key`(`id`),
    UNIQUE INDEX `RankingItem_text_key`(`text`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RankingItemInstance` (
    `id` VARCHAR(191) NOT NULL,
    `rankingId` VARCHAR(191) NOT NULL,
    `rankingItemId` VARCHAR(191) NOT NULL,
    `elo` INTEGER NOT NULL,

    UNIQUE INDEX `RankingItemInstance_id_key`(`id`),
    INDEX `RankingItemInstance_rankingId_idx`(`rankingId`),
    INDEX `RankingItemInstance_rankingItemId_idx`(`rankingItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Account_userId_idx` ON `Account`(`userId`);
