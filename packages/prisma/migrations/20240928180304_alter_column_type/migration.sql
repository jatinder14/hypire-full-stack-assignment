/*
  Warnings:

  - You are about to alter the column `name` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[parent_id]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menu_id]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(0);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_parent_id_key" ON "MenuItem"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menu_id_key" ON "MenuItem"("menu_id");
