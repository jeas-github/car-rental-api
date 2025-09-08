/*
  Warnings:

  - Made the column `return_date` on table `rentals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `final_value` on table `rentals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `rentals` MODIFY `return_date` DATETIME(3) NOT NULL,
    MODIFY `final_value` DECIMAL(10, 2) NOT NULL;
