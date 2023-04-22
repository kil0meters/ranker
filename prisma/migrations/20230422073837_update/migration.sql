-- DropIndex
DROP INDEX `RankingItem_text_key` ON `RankingItem`;

-- AlterTable
ALTER TABLE `Ranking` MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `RankingItem` MODIFY `text` TEXT NOT NULL;
