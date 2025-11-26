/*
  Warnings:

  - A unique constraint covering the columns `[contexto,chave]` on the table `parametro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `parametro_contexto_chave_key` ON `parametro`(`contexto`, `chave`);
