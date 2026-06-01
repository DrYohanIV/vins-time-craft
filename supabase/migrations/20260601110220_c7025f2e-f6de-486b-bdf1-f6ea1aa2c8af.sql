DROP POLICY IF EXISTS "users create own orders" ON public.orders;

CREATE POLICY "users create own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');