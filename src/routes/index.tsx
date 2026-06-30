import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/hooks/use-auth";
import { Gamepad2, MessageCircle, Sparkles, CheckCircle2, Bell, Users, Heart, Radar } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/local_client";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ElderLink — 陪伴長者每一天" },
      { name: "description", content: "為長者而設的陪伴應用，遊戲、聊天、AI 建議與每日打卡，賺積分換日用品。" },
    ],
  }),
});

const featureDefs = [
  { to: "/game", icon: Gamepad2, tKey: "game", tint: "from-primary to-[oklch(0.62_0.2_35)]" },
  { to: "/chat", icon: MessageCircle, tKey: "chat", tint: "from-[oklch(0.6_0.15_55)] to-accent" },
  { to: "/ai", icon: Sparkles, tKey: "ai", tint: "from-[oklch(0.55_0.16_145)] to-[oklch(0.72_0.14_140)]" },
  { to: "/checkin", icon: CheckCircle2, tKey: "checkin", tint: "from-[oklch(0.55_0.18_295)] to-[oklch(0.7_0.15_310)]" },
] as const;

function Home() {
  const { user } = useAuth();
  if (!user) {
    return <LandingPage />;
  }
  return <Dashboard />;
}

function Dashboard() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [greet, setGreet] = useState(t("home.greet.morning"));

  const { data: checkins } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("checkins").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: plays } = useQuery({
    queryKey: ["game_plays", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("game_plays").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const totalPoints = useMemo(() => {
    const checkinPoints = (checkins?.length || 0) * 20;
    const gamePoints = plays?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0;
    return checkinPoints + gamePoints;
  }, [checkins, plays]);
  
  const pointsGoal = 1000;
  const progressPercentage = Math.min(100, (totalPoints / pointsGoal) * 100);

  const today = new Date().toDateString();

  const noonChecked = useMemo(() => 
    checkins?.some(c => new Date(c.created_at).toDateString() === today && c.kind === "noon"), 
    [checkins, today]
  );

  const eveningChecked = useMemo(() => 
    checkins?.some(c => new Date(c.created_at).toDateString() === today && c.kind === "evening"), 
    [checkins, today]
  );

  const nextCheckinText = useMemo(() => {
    if (!noonChecked) {
      return lang === "zh" ? "中午 11 點" : "11:00 AM";
    }
    if (!eveningChecked) {
      return lang === "zh" ? "夜晚 6 點" : "6:00 PM";
    }
    return lang === "zh" ? "聽日中午 11 點" : "Tomorrow 11:00 AM";
  }, [noonChecked, eveningChecked, lang]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreet(h < 11 ? t("home.greet.morning") : h < 18 ? t("home.greet.afternoon") : t("home.greet.evening"));
    
    async function getProfile() {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
      if (data) setDisplayName(data.display_name);
    }
    getProfile();
  }, [t, user]);

  return (
    <AppShell>
      <section className="px-5 pt-6 pb-4">
        <p className="text-muted-foreground">{greet}, {displayName || t("home.user")}</p>
        <h1 className="text-3xl font-display mt-1">{t("home.title1")} <span className="text-primary">{t("home.title2")}</span></h1>
      </section>

      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.58_0.2_30)] to-[oklch(0.65_0.18_45)] text-primary-foreground p-6 shadow-lg">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <p className="opacity-90">{t("home.points")}</p>
            <p className="text-5xl font-display mt-1">{totalPoints.toLocaleString()} {t("home.pointsUnit")}</p>
            
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--gold)] rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
            <Link to="/rewards" className="inline-flex items-center gap-1.5 mt-5 bg-white text-primary px-5 py-3 rounded-full font-semibold">
              {t("home.redeem")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-4">
          <Bell className="w-5 h-5 text-primary shrink-0" />
          <p>{t("home.nextCheckin")}<span className="font-semibold text-primary ml-1">{nextCheckinText}</span></p>
        </div>
      </section>

      <section className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Link to="/nearby" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.55_0.16_145)] via-primary to-[var(--gold)] text-primary-foreground p-4 shadow-lg active:scale-[0.98] transition">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2"><Radar className="w-6 h-6" /></div>
          <p className="text-lg font-display leading-tight">{t("home.nearby.title")}</p>
          <p className="opacity-90 text-xs mt-0.5">{t("home.nearby.desc")}</p>
        </Link>
        <Link to="/family" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.55_0.18_295)] via-primary to-accent text-primary-foreground p-4 shadow-lg active:scale-[0.98] transition">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2"><Users className="w-6 h-6" /></div>
          <p className="text-lg font-display leading-tight">{t("home.familyView.title")}</p>
          <p className="opacity-90 text-xs mt-0.5">{t("home.familyView.desc")}</p>
        </Link>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-2xl font-display mb-3">{t("home.whatToDo")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {featureDefs.map((f) => (
            <Link key={f.to} to={f.to} className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 transition-all active:scale-95">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.tint} flex items-center justify-center text-white mb-3 shadow-sm`}><f.icon className="w-7 h-7" /></div>
              <p className="font-semibold text-lg">{t(`home.f.${f.tKey}.title`)}</p>
              <p className="text-muted-foreground mt-1">{t(`home.f.${f.tKey}.desc`)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl bg-gradient-to-br from-cream to-secondary p-5 border border-border">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5 fill-primary" />
            <p className="font-semibold text-lg">{t("home")}</p>
          </div>
          <p className="text-muted-foreground mt-2">{t("home.familyDesc")}</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-accent border-2 border-card flex items-center justify-center text-sm font-semibold">{t("home.son")}</div>
              <div className="w-9 h-9 rounded-full bg-[var(--gold)] border-2 border-card flex items-center justify-center text-sm font-semibold">{t("home.daughter")}</div>
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground border-2 border-card flex items-center justify-center text-sm font-semibold">{t("home.grandchild")}</div>
            </div>
            <button className="ml-auto text-sm font-semibold text-primary flex items-center gap-1"><Users className="w-4 h-4" /> {t("home.share")}</button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}