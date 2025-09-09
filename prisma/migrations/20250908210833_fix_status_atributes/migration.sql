-- AlterTable
ALTER TABLE `rental_points` ADD COLUMN `status` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo';
