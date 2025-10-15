-- CreateTable
CREATE TABLE `notificacao` (
    `id` VARCHAR(191) NOT NULL,
    `assunto` VARCHAR(191) NOT NULL,
    `conteudo` TEXT NOT NULL,
    `icone` VARCHAR(191) NULL,
    `context` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `pendente` BOOLEAN NOT NULL,
    `sonoro` BOOLEAN NOT NULL,
    `identificacao` VARCHAR(191) NOT NULL,
    `url_destino` TEXT NULL,
    `criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativa` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
