/*
  Warnings:

  - You are about to drop the column `rental_location_id` on the `cars` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cars` DROP FOREIGN KEY `cars_rental_location_id_fkey`;

-- DropIndex
DROP INDEX `cars_rental_location_id_fkey` ON `cars`;

-- AlterTable
ALTER TABLE `cars` DROP COLUMN `rental_location_id`;
