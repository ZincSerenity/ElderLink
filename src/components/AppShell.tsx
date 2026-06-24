import { Link, useLocation } from "@tanstack/react-router";
import { Gamepad2, MessageCircle, Sparkles, CheckCircle2, Home, Gift, Languages, LogIn, LogOut, User as UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success(lang === "zh" ? "已登出" : "Signed out");
  }

  const tabs = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/game", label: t("nav.game"), icon: Gamepad2 },
    { to: "/chat", label: t("nav.chat"), icon: MessageCircle },
    { to: "/ai", label: t("nav.ai"), icon: Sparkles },
    { to: "/checkin", label: t("nav.checkin"), icon: CheckCircle2 },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display text-2xl shadow-md shrink-0">EL</div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none">ElderLink</p>
              <p className="text-muted-foreground mt-1 truncate">{t("app.tagline")}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 bg-secondary text-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition"
            >
              <Languages className="w-5 h-5" />
              <span className="hidden sm:inline">{t("lang.toggle")}</span>
            </button>
            <Link to="/rewards" className="flex items-center gap-1.5 bg-gradient-to-br from-[var(--gold)] to-accent text-accent-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm">
              <Gift className="w-5 h-5" /> 1,280
            </Link>
            {user ? (
              <button
                onClick={signOut}
                aria-label="Sign out"
                title={user.email ?? user.phone ?? ""}
                className="flex items-center gap-1.5 bg-secondary text-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition"
              >
                <UserIcon className="w-5 h-5" />
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition"
              >
                <LogIn className="w-5 h-5" />
                <span>{lang === "zh" ? "登入" : "Sign in"}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5 max-w-xl mx-auto">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center py-3 gap-1 transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-primary/10 scale-105" : ""}`}>
                  <Icon className="w-7 h-7" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="font-semibold -mt-0.5 text-sm">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
