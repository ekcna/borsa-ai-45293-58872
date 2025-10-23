-- Create payment_requests table for manual payment tracking
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_plan TEXT NOT NULL CHECK (requested_plan IN ('pro', 'ultimate')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment requests
CREATE POLICY "Users can view own payment requests"
  ON public.payment_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own payment requests
CREATE POLICY "Users can create payment requests"
  ON public.payment_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_requests_updated_at
  BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for faster queries
CREATE INDEX idx_payment_requests_user_id ON public.payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON public.payment_requests(status);