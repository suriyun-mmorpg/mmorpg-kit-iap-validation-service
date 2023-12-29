-- CreateTable
CREATE TABLE `iap_validation_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(50) NOT NULL,
    `characterId` VARCHAR(50) NOT NULL,
    `store` VARCHAR(50) NOT NULL,
    `transactionID` VARCHAR(50) NOT NULL,
    `payload` TEXT NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
