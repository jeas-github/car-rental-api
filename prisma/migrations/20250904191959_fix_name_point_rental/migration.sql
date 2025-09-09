/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `rental_points` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `rental_points_name_key` ON `rental_points`(`name`);
