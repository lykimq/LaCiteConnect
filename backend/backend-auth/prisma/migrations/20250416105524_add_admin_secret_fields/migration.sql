-- AlterTable
ALTER TABLE "users" ADD COLUMN     "admin_secret_hash" TEXT,
ADD COLUMN     "admin_secret_salt" TEXT,
ADD COLUMN     "password_reset_expiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_password_reset_token_idx" ON "users"("password_reset_token");

-- CreateIndex
CREATE INDEX "users_password_reset_expiry_idx" ON "users"("password_reset_expiry");
