/*
  Warnings:

  - You are about to alter the column `amount` on the `Transcations` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Transcations" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
