import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Gift, Clock } from "lucide-react";
import { useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

function RewardsPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();

  // 1. Fetch live check-in history to extract points
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

  // 2. Fetch live mini-game activity logs
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

  // 3. Compute live unified dynamic points sum total
  const totalPoints = useMemo(() => {
    const checkinPoints = (checkins?.length || 0) * 20;
    const gamePoints = plays?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0;
    return checkinPoints + gamePoints;
  }, [checkins, plays]);

  return (
    <AppShell>
      {/* HEADER SECTION */}
      <section className="px-5 pt-6 flex items-center gap-3">
        <Link to="/" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center transition active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-display">{t("rw.title")}</h1>
          <p className="text-muted-foreground">{t("rw.subtitle")}</p>
        </div>
      </section>

      {/* FIXED DYNAMIC POINTS BALANCE DISPLAY CARD */}
      <section className="px-5 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-[var(--gold)] to-accent p-5 text-accent-foreground flex items-center justify-between shadow-md">
          <div>
            <p className="font-medium opacity-90">{t("rw.points")}</p>
            <p className="text-4xl font-display mt-1">{totalPoints.toLocaleString()} {t("rw.unit")}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Gift className="w-8 h-8 text-accent-foreground" />
          </div>
        </div>
      </section>

      {/* CLEAN ELDER-FRIENDLY "COMING SOON" ANNOUNCEMENT BANNER WRAPPER */}
      <section className="px-5 mt-8 flex-1 flex flex-col items-center justify-center text-center py-10">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display text-foreground">
          {lang === "zh" ? "禮品換領功能即將推出" : "Rewards Center Coming Soon"}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-[280px] text-sm leading-relaxed">
          {lang === "zh" 
            ? "我們的團隊正努力為您接洽各大超市及日常用品商戶！現在玩遊戲及打卡累積的積分將會安全保留，敬請期待。" 
            : "We are currently setting up partnerships with supermarket stores. All points you earn now from games and daily check-ins are securely saved!"}
        </p>
      </section>
    </AppShell>
  );
}