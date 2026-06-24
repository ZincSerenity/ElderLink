import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const PUBLIC_PATHS = new Set(["/", "/auth"]);

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isPublic = PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      navigate({ to: "/auth", replace: true });
    }
  }, [loading, user, isPublic, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Redirecting…</div>
      </div>
    );
  }

  return <>{children}</>;
}
