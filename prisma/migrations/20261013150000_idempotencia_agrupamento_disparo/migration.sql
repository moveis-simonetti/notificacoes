-- AlterTable
ALTER TABLE `notificacao` ADD COLUMN `agrupamento` VARCHAR(191) NULL,
    ADD COLUMN `disparada_em` DATETIME(3) NULL,
    ADD COLUMN `idempotencia` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `notificacao_login_idempotencia_key` ON `notificacao`(`login`, `idempotencia`);

