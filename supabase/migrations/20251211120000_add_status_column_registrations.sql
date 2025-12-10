-- Migration: add `status` column to registrations
-- Run this in the Supabase SQL editor or via your migration workflow.

BEGIN;

-- Add status column with default 'pending' if it doesn't exist
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Backfill existing NULLs to 'pending'
UPDATE public.registrations
SET status = 'pending'
WHERE status IS NULL;

COMMIT;

-- Notes:
-- - This migration adds a nullable text `status` column with a default of 'pending'.
-- - If you prefer an enum or different defaults, adjust before running.
-- - After running, client-side admin confirm will be able to update `registrations.status`.
