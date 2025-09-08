/*
  Warnings:

  - You are about to alter the column `category` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `rentals` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `cars` MODIFY `category` ENUM('econômica', 'sedan', 'suv', 'luxo', 'minivan') NOT NULL DEFAULT 'econômica',
    MODIFY `status` ENUM('disponível', 'alugado', 'manutenção', 'desativado') NOT NULL DEFAULT 'disponível';

-- AlterTable
ALTER TABLE `clients` MODIFY `status` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo';

-- AlterTable
ALTER TABLE `rentals` MODIFY `status` ENUM('pendente', 'ativo', 'concluído', 'cancelado') NOT NULL DEFAULT 'pendente';
