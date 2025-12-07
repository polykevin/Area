-- CreateTable
CREATE TABLE "ServiceAuth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "ServiceAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actionService" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionParams" JSONB NOT NULL,
    "reactionService" TEXT NOT NULL,
    "reactionType" TEXT NOT NULL,
    "reactionParams" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAuth_userId_service_key" ON "ServiceAuth"("userId", "service");

-- AddForeignKey
ALTER TABLE "ServiceAuth" ADD CONSTRAINT "ServiceAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
