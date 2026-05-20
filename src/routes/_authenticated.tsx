import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated")({ component: Layout });

function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: window.location.pathname } });
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!user) return null;
  return <Outlet />;
}
