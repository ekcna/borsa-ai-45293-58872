-- Update the apply_lifetime_code function to only accept "CAF12-12"
CREATE OR REPLACE FUNCTION public.apply_lifetime_code(code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if code is exactly "CAF12-12"
  IF code = 'CAF12-12' THEN
    UPDATE public.profiles
    SET plan = 'ultimate', lifetime_code = code
    WHERE id = auth.uid();
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;