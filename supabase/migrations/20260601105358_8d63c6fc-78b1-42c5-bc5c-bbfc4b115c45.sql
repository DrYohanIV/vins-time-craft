
-- 1. Restrict discount codes to authenticated users only (hide codes from anon)
DROP POLICY IF EXISTS "anyone read active codes" ON public.discount_codes;
CREATE POLICY "authenticated read active codes"
ON public.discount_codes
FOR SELECT
TO authenticated
USING (active = true OR has_role(auth.uid(), 'admin'::app_role));

-- 2. Replace permissive WITH CHECK (true) on messages with input validation
DROP POLICY IF EXISTS "anyone send messages" ON public.messages;
CREATE POLICY "anyone send messages"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(body) BETWEEN 1 AND 5000
  AND (phone IS NULL OR length(phone) <= 50)
  AND (subject IS NULL OR length(subject) <= 300)
);

-- 3. Tighten EXECUTE on SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
