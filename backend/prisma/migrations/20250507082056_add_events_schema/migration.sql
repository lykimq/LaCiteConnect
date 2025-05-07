-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlisted');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('email', 'sms', 'push', 'all');

-- CreateEnum
CREATE TYPE "TimeSlotStatus" AS ENUM ('available', 'reserved', 'full', 'cancelled');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_google_account" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "photo_url" TEXT;

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "picture_url" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'draft',
    "max_participants" INTEGER,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_time_slots" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "current_capacity" INTEGER NOT NULL DEFAULT 0,
    "status" "TimeSlotStatus" NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT,
    "time_slot_id" TEXT,
    "registration_status" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "number_of_guests" INTEGER NOT NULL DEFAULT 0,
    "additional_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_notification_preferences" (
    "id" TEXT NOT NULL,
    "registration_id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL DEFAULT 'email',
    "reminder_time" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_shares" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "shared_by" TEXT,
    "platform" TEXT NOT NULL,
    "share_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_start_time_end_time_idx" ON "events"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "events_created_by_idx" ON "events"("created_by");

-- CreateIndex
CREATE INDEX "event_time_slots_event_id_idx" ON "event_time_slots"("event_id");

-- CreateIndex
CREATE INDEX "event_time_slots_status_idx" ON "event_time_slots"("status");

-- CreateIndex
CREATE INDEX "event_registrations_event_id_idx" ON "event_registrations"("event_id");

-- CreateIndex
CREATE INDEX "event_registrations_user_id_idx" ON "event_registrations"("user_id");

-- CreateIndex
CREATE INDEX "event_registrations_registration_status_idx" ON "event_registrations"("registration_status");

-- CreateIndex
CREATE INDEX "event_notification_preferences_registration_id_idx" ON "event_notification_preferences"("registration_id");

-- CreateIndex
CREATE INDEX "event_shares_event_id_idx" ON "event_shares"("event_id");

-- CreateIndex
CREATE INDEX "event_shares_shared_by_idx" ON "event_shares"("shared_by");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_time_slots" ADD CONSTRAINT "event_time_slots_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "event_time_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_notification_preferences" ADD CONSTRAINT "event_notification_preferences_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "event_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_shares" ADD CONSTRAINT "event_shares_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_shares" ADD CONSTRAINT "event_shares_shared_by_fkey" FOREIGN KEY ("shared_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
