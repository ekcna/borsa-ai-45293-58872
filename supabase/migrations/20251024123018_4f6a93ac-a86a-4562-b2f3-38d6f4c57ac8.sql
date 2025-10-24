-- Add plan expiration column to profiles
ALTER TABLE public.profiles 
ADD COLUMN plan_expires_at TIMESTAMP WITH TIME ZONE;

-- Create function to check if plan is expired and downgrade if needed
CREATE OR REPLACE FUNCTION public.check_plan_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET plan = 'free', plan_expires_at = NULL
  WHERE plan_expires_at IS NOT NULL 
    AND plan_expires_at < NOW()
    AND lifetime_code IS NULL
    AND plan != 'free';
END;
$$;

-- Update approve_payment_request to set expiration date (1 month)
CREATE OR REPLACE FUNCTION public.approve_payment_request(request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_plan TEXT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve payment requests';
  END IF;

  SELECT user_id, requested_plan INTO v_user_id, v_plan
  FROM public.payment_requests
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  UPDATE public.payment_requests
  SET status = 'approved', updated_at = NOW()
  WHERE id = request_id;

  -- Update user's plan with 1 month expiration (unless they have lifetime code)
  UPDATE public.profiles
  SET 
    plan = v_plan::subscription_plan, 
    plan_expires_at = CASE 
      WHEN lifetime_code IS NULL THEN NOW() + INTERVAL '1 month'
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;