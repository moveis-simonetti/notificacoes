-- AlterTable
ALTER TABLE `notificacao` ADD COLUMN `excluida_em` DATETIME(3) NULL,
    ADD COLUMN `lida_em` DATETIME(3) NULL,
    ADD COLUMN `mobile` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `subtitulo` VARCHAR(191) NULL;
