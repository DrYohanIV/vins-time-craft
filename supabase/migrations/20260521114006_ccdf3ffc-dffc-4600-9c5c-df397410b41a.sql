
CREATE OR REPLACE FUNCTION public.decrement_watch_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock INT;
BEGIN
  IF NEW.watch_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT stock INTO current_stock FROM public.watches WHERE id = NEW.watch_id FOR UPDATE;
  IF current_stock IS NULL THEN
    RETURN NEW;
  END IF;
  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for watch %', NEW.watch_name;
  END IF;
  UPDATE public.watches SET stock = stock - NEW.quantity, updated_at = now() WHERE id = NEW.watch_id;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.restore_watch_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.watch_id IS NOT NULL THEN
    UPDATE public.watches SET stock = stock + OLD.quantity, updated_at = now() WHERE id = OLD.watch_id;
  END IF;
  RETURN OLD;
END; $$;

DROP TRIGGER IF EXISTS order_items_decrement_stock ON public.order_items;
CREATE TRIGGER order_items_decrement_stock
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.decrement_watch_stock();

DROP TRIGGER IF EXISTS order_items_restore_stock ON public.order_items;
CREATE TRIGGER order_items_restore_stock
AFTER DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.restore_watch_stock();
