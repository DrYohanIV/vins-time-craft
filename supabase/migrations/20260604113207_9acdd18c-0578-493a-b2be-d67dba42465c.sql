
ALTER TABLE public.watches ADD COLUMN IF NOT EXISTS hot_seller boolean NOT NULL DEFAULT false;

CREATE TABLE public.brand_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brand_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_categories TO authenticated;
GRANT ALL ON public.brand_categories TO service_role;
ALTER TABLE public.brand_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone view active brand categories" ON public.brand_categories
  FOR SELECT TO anon, authenticated
  USING (active = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage brand categories" ON public.brand_categories
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_brand_categories_updated_at BEFORE UPDATE ON public.brand_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.collection_size AS ENUM ('small', 'medium', 'large', 'wide', 'tall');

CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text,
  size public.collection_size NOT NULL DEFAULT 'medium',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone view active collections" ON public.collections
  FOR SELECT TO anon, authenticated
  USING (active = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage collections" ON public.collections
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
