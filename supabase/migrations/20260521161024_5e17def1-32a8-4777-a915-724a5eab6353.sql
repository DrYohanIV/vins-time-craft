GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
INSERT INTO public.user_roles (user_id, role)
VALUES ('e4acd114-14a6-488d-b18a-a022ce85fbd0', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;