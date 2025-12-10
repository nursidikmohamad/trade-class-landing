-- Add registration_token to registrations table
ALTER TABLE public.registrations 
ADD COLUMN registration_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;

-- Create payment_confirmations table
CREATE TABLE public.payment_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_token TEXT NOT NULL,
  sender_account_number TEXT NOT NULL,
  class_price NUMERIC NOT NULL,
  payment_proof_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_confirmations
CREATE POLICY "Anyone can insert payment confirmations"
ON public.payment_confirmations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all payment confirmations"
ON public.payment_confirmations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payment confirmations"
ON public.payment_confirmations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES 
  ('account_holder_name', 'Nama Pemilik'),
  ('account_number', '1234567890'),
  ('class_price', '500000'),
  ('whatsapp_number', '6281234567890')
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Storage policies
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Anyone can view payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Admins can delete payment proofs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role));