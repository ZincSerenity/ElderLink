import { Link, useLocation } from "@tanstack/react-router";
import { Gamepad2, MessageCircle, Sparkles, CheckCircle2, Home, Gift, Languages, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";
import { toast } from "sonner";

// 使用原生隨建 URL 解析，完全繞過 TypeScript 對靜態點 PNG 資源的阻擋
const logoIcon = new URL("../assets/icon.png", import.meta.url).href;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();

  // 1. Fetch live check-in data for the top bar balance counter
  const { data: checkins } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // 2. Fetch live game history data for the top bar balance counter
  const { data: plays } = useQuery({
    queryKey: ["game_plays", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_plays")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user profile to display custom avatar if available
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  // 3. Dynamically aggregate total live points safely
  const totalPoints = useMemo(() => {
    if (!user?.id) return 0;
    const checkinPoints = (checkins?.length || 0) * 20;
    const gamePoints = plays?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0;
    return checkinPoints + gamePoints;
  }, [checkins, plays, user?.id]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success(lang === "zh" ? "已登出" : "Signed out");
  }

  const tabs = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/game", label: t("nav.game"), icon: Gamepad2 },
    { to: "/chat", label: t("nav.chat"), icon: MessageCircle },
    { to: "/ai", icon: Sparkles, label: t("nav.ai") },
    { to: "/checkin", label: t("nav.checkin"), icon: CheckCircle2 },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            {/* 圓形品牌圖標組件 */}
            <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden bg-white">
              <img src={logoIcon} alt="ElderLink Logo" className="w-full h-full object-cover" />
            </div>
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
            
            {/* GLOBAL POINTS COUNTER */}
            <Link to="/rewards" className="flex items-center gap-1.5 bg-gradient-to-br from-[var(--gold)] to-accent text-accent-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition">
              <Gift className="w-5 h-5" /> 
              {totalPoints.toLocaleString()}
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5">
                {/* ACCOUNT PAGE ENTRANCE KEY */}
                <Link
                  to="/account"
                  title="帳戶設定"
                  className="flex items-center justify-center w-10 h-10 bg-secondary text-foreground rounded-full shadow-sm active:scale-95 transition overflow-hidden"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </Link>

                {/* SEPARATED SIGN OUT BUTTON */}
                <button
                  onClick={signOut}
                  aria-label="Sign out"
                  className="flex items-center justify-center w-10 h-10 bg-secondary text-muted-foreground hover:text-red-500 rounded-full shadow-sm active:scale-95 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "signin" }}
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