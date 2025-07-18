/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[spaceId]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spaceId` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropIndex
DROP INDEX "Repository_projectId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "projectId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "projectId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_TeamMembers";

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_spaceId_key" ON "Repository"("spaceId");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
