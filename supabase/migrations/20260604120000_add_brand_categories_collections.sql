-- Brand categories (manageable brand image carousel on homepage)
CREATE TABLE public.brand_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.brand_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone view active brand_categories" ON public.brand_categories FOR SELECT TO anon, authenticated USING (active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage brand_categories" ON public.brand_categories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER brand_categories_updated BEFORE UPDATE ON public.brand_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Explore collections (custom-size banner sections on homepage)
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  banner_url text,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone view active collections" ON public.collections FOR SELECT TO anon, authenticated USING (active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage collections" ON public.collections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER collections_updated BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
