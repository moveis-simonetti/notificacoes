-- CreateTable
CREATE TABLE `parametro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contexto` VARCHAR(191) NOT NULL,
    `chave` VARCHAR(191) NOT NULL,
    `valor` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
