/*
  Warnings:

  - Added the required column `rental_location_id` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cars` ADD COLUMN `rental_location_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_rental_location_id_fkey` FOREIGN KEY (`rental_location_id`) REFERENCES `rental_locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
