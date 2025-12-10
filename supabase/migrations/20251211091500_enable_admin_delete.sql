-- Migration: Enable RLS and allow admin users to select/update/delete
-- Run this in Supabase SQL Editor or apply via supabase migrations.

-- Enable row level security if not already enabled
ALTER TABLE IF EXISTS public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Policies for registrations
DROP POLICY IF EXISTS "Admins can select registrations" ON public.registrations;
CREATE POLICY "Admins can select registrations"
  ON public.registrations
  FOR SELECT
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
CREATE POLICY "Admins can update registrations"
  ON public.registrations
  FOR UPDATE
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;
CREATE POLICY "Admins can delete registrations"
  ON public.registrations
  FOR DELETE
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

-- Policies for payment_confirmations
DROP POLICY IF EXISTS "Admins can select payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Admins can select payment_confirmations"
  ON public.payment_confirmations
  FOR SELECT
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Admins can update payment_confirmations"
  ON public.payment_confirmations
  FOR UPDATE
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Admins can delete payment_confirmations"
  ON public.payment_confirmations
  FOR DELETE
  USING (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

-- Notes:
-- - Ensure `user_roles` table exists and contains (user_id, role) rows for admin users.
-- - If you prefer to authorize by a custom claim on JWT, adjust `auth.uid()` checks accordingly.
