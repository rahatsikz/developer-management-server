-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "_SpaceMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpaceMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SpaceMembers_B_index" ON "_SpaceMembers"("B");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpaceMembers" ADD CONSTRAINT "_SpaceMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpaceMembers" ADD CONSTRAINT "_SpaceMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
