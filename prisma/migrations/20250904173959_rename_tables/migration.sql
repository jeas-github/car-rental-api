/*
  Warnings:

  - You are about to drop the `car` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rental` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rentalpoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_current_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `rental` DROP FOREIGN KEY `Rental_car_id_fkey`;

-- DropForeignKey
ALTER TABLE `rental` DROP FOREIGN KEY `Rental_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `rental` DROP FOREIGN KEY `Rental_pickup_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `rental` DROP FOREIGN KEY `Rental_return_point_id_fkey`;

-- DropTable
DROP TABLE `car`;

-- DropTable
DROP TABLE `client`;

-- DropTable
DROP TABLE `rental`;

-- DropTable
DROP TABLE `rentalpoint`;

-- CreateTable
CREATE TABLE `clients` (
    `client_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clients_cpf_key`(`cpf`),
    UNIQUE INDEX `clients_email_key`(`email`),
    UNIQUE INDEX `clients_phone_key`(`phone`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rental_points` (
    `point_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cars` (
    `car_id` VARCHAR(191) NOT NULL,
    `license_plate` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `category` ENUM('economic', 'sedan', 'suv', 'luxury', 'minivan') NOT NULL DEFAULT 'economic',
    `status` ENUM('available', 'rented', 'maintenance', 'deactivated') NOT NULL DEFAULT 'available',
    `daily_rate` DECIMAL(65, 30) NOT NULL,
    `current_point_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cars_license_plate_key`(`license_plate`),
    PRIMARY KEY (`car_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rentals` (
    `rental_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `car_id` VARCHAR(191) NOT NULL,
    `pickup_point_id` VARCHAR(191) NOT NULL,
    `return_point_id` VARCHAR(191) NOT NULL,
    `pickup_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NOT NULL,
    `final_value` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('pending', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rental_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_current_point_id_fkey` FOREIGN KEY (`current_point_id`) REFERENCES `rental_points`(`point_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`client_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`car_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_pickup_point_id_fkey` FOREIGN KEY (`pickup_point_id`) REFERENCES `rental_points`(`point_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_return_point_id_fkey` FOREIGN KEY (`return_point_id`) REFERENCES `rental_points`(`point_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
