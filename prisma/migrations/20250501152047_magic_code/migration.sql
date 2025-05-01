-- CreateTable
CREATE TABLE "magic_code" (
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "magic_code_email_key" ON "magic_code"("email");
