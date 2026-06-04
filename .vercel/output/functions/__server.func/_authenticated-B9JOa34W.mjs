import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { a as useAuth } from "./_ssr/router-BI-Nvu9e.mjs";
import "./_libs/sonner.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/client-BTzMKr_B.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/lucide-react.mjs";
function Layout() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/auth",
      search: {
        redirect: window.location.pathname
      }
    });
  }, [user, loading, navigate]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Loading…" });
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
}
export {
  Layout as component
};
