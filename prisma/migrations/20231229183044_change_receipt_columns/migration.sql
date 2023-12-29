/*
  Warnings:

  - You are about to drop the column `payload` on the `iap_validation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `store` on the `iap_validation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `transactionID` on the `iap_validation_logs` table. All the data in the column will be lost.
  - Added the required column `receipt` to the `iap_validation_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `iap_validation_logs` DROP COLUMN `payload`,
    DROP COLUMN `store`,
    DROP COLUMN `transactionID`,
    ADD COLUMN `receipt` TEXT NOT NULL;
