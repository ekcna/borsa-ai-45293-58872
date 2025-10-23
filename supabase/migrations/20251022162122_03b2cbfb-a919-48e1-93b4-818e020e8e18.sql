-- Add RLS policy for admins to view all payment requests
CREATE POLICY "Admins can view all payment requests"
  ON public.payment_requests
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to update payment requests
CREATE POLICY "Admins can update payment requests"
  ON public.payment_requests
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to approve payment request and upgrade user
CREATE OR REPLACE FUNCTION public.approve_payment_request(request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_plan TEXT;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve payment requests';
  END IF;

  -- Get payment request details
  SELECT user_id, requested_plan INTO v_user_id, v_plan
  FROM public.payment_requests
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Update payment request status
  UPDATE public.payment_requests
  SET status = 'approved', updated_at = NOW()
  WHERE id = request_id;

  -- Update user's plan
  UPDATE public.profiles
  SET plan = v_plan::subscription_plan, updated_at = NOW()
  WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;

-- Create function to reject payment request
CREATE OR REPLACE FUNCTION public.reject_payment_request(request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject payment requests';
  END IF;

  -- Update payment request status
  UPDATE public.payment_requests
  SET status = 'rejected', updated_at = NOW()
  WHERE id = request_id AND status = 'pending';

  RETURN FOUND;
END;
$$;