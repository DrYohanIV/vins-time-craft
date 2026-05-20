
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_admin_count INT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT COUNT(*) INTO existing_admin_count FROM public.user_roles WHERE role = 'admin';
  IF existing_admin_count > 0 THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END; $$;

GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;
