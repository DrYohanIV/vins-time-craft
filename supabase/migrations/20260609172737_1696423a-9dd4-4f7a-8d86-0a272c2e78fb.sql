-- 1) Restrict discount_codes SELECT to admins only
DROP POLICY IF EXISTS "authenticated read active codes" ON public.discount_codes;
DROP POLICY IF EXISTS "anyone read active codes" ON public.discount_codes;

-- Ensure admin-only SELECT policy exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='discount_codes' AND policyname='admins read discount codes'
  ) THEN
    CREATE POLICY "admins read discount codes" ON public.discount_codes
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 2) Enforce unit_price matches watches.price at insert time via trigger
CREATE OR REPLACE FUNCTION public.enforce_order_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  authoritative_price NUMERIC;
  authoritative_name TEXT;
BEGIN
  IF NEW.watch_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT price, name INTO authoritative_price, authoritative_name
    FROM public.watches WHERE id = NEW.watch_id;
  IF authoritative_price IS NULL THEN
    RAISE EXCEPTION 'Watch % not found', NEW.watch_id;
  END IF;
  -- Force trusted values regardless of client input
  NEW.unit_price := authoritative_price;
  NEW.watch_name := COALESCE(authoritative_name, NEW.watch_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_item_price_trg ON public.order_items;
CREATE TRIGGER enforce_order_item_price_trg
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_item_price();