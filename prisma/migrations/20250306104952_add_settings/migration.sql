-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT '1',
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
