-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL DEFAULT '(UUID())',
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL DEFAULT '(UUID())',
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ranking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `popularity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ranking_publicId_key`(`publicId`),
    INDEX `Ranking_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RankingItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rankingId` INTEGER NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `globalElo` INTEGER NOT NULL DEFAULT 1000,

    UNIQUE INDEX `RankingItem_id_key`(`id`),
    UNIQUE INDEX `RankingItem_publicId_key`(`publicId`),
    INDEX `RankingItem_rankingId_idx`(`rankingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRankingItemElo` (
    `userId` VARCHAR(191) NOT NULL,
    `rankingItemId` INTEGER NOT NULL,
    `elo` INTEGER NOT NULL DEFAULT 1000,

    INDEX `UserRankingItemElo_userId_idx`(`userId`),
    INDEX `UserRankingItemElo_rankingItemId_idx`(`rankingItemId`),
    UNIQUE INDEX `UserRankingItemElo_userId_rankingItemId_key`(`userId`, `rankingItemId`),
    PRIMARY KEY (`userId`, `rankingItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRankingItemChoiceIndex` (
    `userId` VARCHAR(191) NOT NULL,
    `rankingId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 0,

    INDEX `UserRankingItemChoiceIndex_userId_idx`(`userId`),
    INDEX `UserRankingItemChoiceIndex_rankingId_idx`(`rankingId`),
    PRIMARY KEY (`userId`, `rankingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
