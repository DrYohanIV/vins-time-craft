import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/use-auth";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundScene } from "@/components/background-scene";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-3xl p-12 max-w-md text-center">
        <h1 className="text-7xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-3 text-xl font-display">Lost in time</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 rounded-full btn-gold text-sm">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-3xl p-10 max-w-md text-center">
        <h1 className="text-xl font-display">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-6 py-2 rounded-full btn-gold text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vins Watch — Luxury Timepieces in Negombo" },
      { name: "description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:title", content: "Vins Watch — Luxury Timepieces in Negombo" },
      { property: "og:description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Vins Watch — Luxury Timepieces in Negombo" },
      { name: "twitter:description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf886105-6ce5-4fe5-972f-2c11681c2534/id-preview-b7c67747--645bf079-bec0-4e4f-a4d2-3977bac13775.lovable.app-1780311316880.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf886105-6ce5-4fe5-972f-2c11681c2534/id-preview-b7c67747--645bf079-bec0-4e4f-a4d2-3977bac13775.lovable.app-1780311316880.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/asset/Vins logo 01sss.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BackgroundScene />
          <div className="min-h-screen flex flex-col relative">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
          </div>
          <Toaster theme="dark" position="top-right" />
        </CartProvider>

      </AuthProvider>
    </QueryClientProvider>
  );
}
