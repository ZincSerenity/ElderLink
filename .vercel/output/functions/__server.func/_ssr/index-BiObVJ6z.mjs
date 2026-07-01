import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { a as useAuth, u as useLang, s as supabase } from "./router-FEBAZNos.mjs";
import "../_libs/sonner.mjs";
import { L as Languages, d as LogIn, b as CircleCheck, a as Gamepad2, M as MessageCircle, S as Sparkles, p as Heart, R as Radar, B as Bell, k as Users } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const logoIcon = new URL("../assets/icon.png", import.meta.url).href;
function LandingPage() {
  const { lang, setLang, t } = useLang();
  const introFeatures = [
    {
      icon: CircleCheck,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title_zh: "每日安心打卡",
      title_en: "Daily Check-in",
      desc_zh: "定時一鍵記錄平安，自動同步通知屋企人，等每個人都放下一顆心。",
      desc_en: "One-tap daily status check-in, keeping your family updated and worry-free."
    },
    {
      icon: Gamepad2,
      tint: "bg-primary/10 text-primary",
      title_zh: "活腦益智遊戲",
      title_en: "Brain Games",
      desc_zh: "專為長者設計的趣味小遊戲，動動手指鍛鍊大腦，玩完仲可以賺積分。",
      desc_en: "Fun, mind-stimulating mini-games designed to exercise brain power while earning points."
    },
    {
      icon: MessageCircle,
      tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      title_zh: "長者無障礙聊天",
      title_en: "Simple Chat",
      desc_zh: "超大字體與簡化介面，讓長者可以毫無壓力地同屋企人發送溫馨訊息。",
      desc_en: "Ultra-large fonts and simplified UI for elders to text family without stress."
    },
    {
      icon: Sparkles,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      title_zh: "AI 智慧生活助手",
      title_en: "AI Smart Assistant",
      desc_zh: "全天候提供健康溫馨提示、關懷聊天與貼心的日常生活小建議。",
      desc_en: "24/7 personalized companion offering lifestyle tips, care, and healthy advice."
    },
    {
      icon: Heart,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      title_zh: "積分換領日用品",
      title_en: "Points Rewards",
      desc_zh: "打卡或者打遊戲賺到嘅積分，可以喺系統免費換領白米、食油等精美日用品。",
      desc_en: "Earn points through basic tasks and redeem daily essentials like rice or cooking oil."
    },
    {
      icon: Radar,
      tint: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      title_zh: "社區鄰近探索",
      title_en: "Nearby Explorer",
      desc_zh: "發掘屋企附近實用的長者中心、醫療機構與社區精彩活動資訊。",
      desc_en: "Discover convenient elder centers, clinics, and active neighborhood events near home."
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoIcon, alt: "ElderLink Logo", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl leading-none", children: "ElderLink" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 truncate", children: t("app.tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setLang(lang === "zh" ? "en" : "zh"),
            className: "flex items-center gap-1.5 bg-secondary text-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("lang.toggle") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/auth",
            search: { mode: "signin" },
            className: "flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("landing.signIn") })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-xl mx-auto w-full px-5 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "text-center py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mx-auto overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoIcon, alt: "ElderLink Logo", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-display mt-5 leading-tight", children: [
          t("landing.heroTitle1"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("landing.heroTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 text-lg leading-relaxed max-w-sm mx-auto", children: t("landing.heroDesc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/auth",
            search: { mode: "signin" },
            className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-md active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
              t("landing.getStarted")
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 border-t border-border pt-10 pb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display text-center mb-1 text-foreground", children: lang === "zh" ? "核心特色功能" : "Core App Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground text-sm mb-8", children: lang === "zh" ? "專為長者與家人跨代連結打造" : "Tailored specifically for intergenerational companion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: introFeatures.map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg text-foreground", children: lang === "zh" ? f.title_zh : f.title_en }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 leading-relaxed", children: lang === "zh" ? f.desc_zh : f.desc_en })
              ] })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-center text-xs text-muted-foreground border-t border-border pt-6 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ElderLink. All rights reserved."
      ] }) })
    ] })
  ] });
}
const featureDefs = [{
  to: "/game",
  icon: Gamepad2,
  tKey: "game",
  tint: "from-primary to-[oklch(0.62_0.2_35)]"
}, {
  to: "/chat",
  icon: MessageCircle,
  tKey: "chat",
  tint: "from-[oklch(0.6_0.15_55)] to-accent"
}, {
  to: "/ai",
  icon: Sparkles,
  tKey: "ai",
  tint: "from-[oklch(0.55_0.16_145)] to-[oklch(0.72_0.14_140)]"
}, {
  to: "/checkin",
  icon: CircleCheck,
  tKey: "checkin",
  tint: "from-[oklch(0.55_0.18_295)] to-[oklch(0.7_0.15_310)]"
}];
function Home() {
  const {
    user
  } = useAuth();
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LandingPage, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {});
}
function Dashboard() {
  const {
    t,
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  const [displayName, setDisplayName] = reactExports.useState(null);
  const [greet, setGreet] = reactExports.useState(t("home.greet.morning"));
  const {
    data: checkins
  } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("checkins").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const {
    data: plays
  } = useQuery({
    queryKey: ["game_plays", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("game_plays").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const totalPoints = reactExports.useMemo(() => {
    const checkinPoints = (checkins?.length || 0) * 20;
    const gamePoints = plays?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0;
    return checkinPoints + gamePoints;
  }, [checkins, plays]);
  const pointsGoal = 1e3;
  const progressPercentage = Math.min(100, totalPoints / pointsGoal * 100);
  const today = (/* @__PURE__ */ new Date()).toDateString();
  const noonChecked = reactExports.useMemo(() => checkins?.some((c) => new Date(c.created_at).toDateString() === today && c.kind === "noon"), [checkins, today]);
  const eveningChecked = reactExports.useMemo(() => checkins?.some((c) => new Date(c.created_at).toDateString() === today && c.kind === "evening"), [checkins, today]);
  const nextCheckinText = reactExports.useMemo(() => {
    if (!noonChecked) {
      return lang === "zh" ? "中午 11 點" : "11:00 AM";
    }
    if (!eveningChecked) {
      return lang === "zh" ? "夜晚 6 點" : "6:00 PM";
    }
    return lang === "zh" ? "聽日中午 11 點" : "Tomorrow 11:00 AM";
  }, [noonChecked, eveningChecked, lang]);
  reactExports.useEffect(() => {
    const h = (/* @__PURE__ */ new Date()).getHours();
    setGreet(h < 11 ? t("home.greet.morning") : h < 18 ? t("home.greet.afternoon") : t("home.greet.evening"));
    async function getProfile() {
      if (!user) return;
      const {
        data
      } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
      if (data) setDisplayName(data.display_name);
    }
    getProfile();
  }, [t, user]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
        greet,
        ", ",
        displayName || t("home.user")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-display mt-1", children: [
        t("home.title1"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("home.title2") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.58_0.2_30)] to-[oklch(0.65_0.18_45)] text-primary-foreground p-6 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90", children: t("home.points") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-5xl font-display mt-1", children: [
          totalPoints.toLocaleString(),
          " ",
          t("home.pointsUnit")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-2 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[var(--gold)] rounded-full transition-all duration-500", style: {
          width: `${progressPercentage}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rewards", className: "inline-flex items-center gap-1.5 mt-5 bg-white text-primary px-5 py-3 rounded-full font-semibold", children: t("home.redeem") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-card border border-border rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-primary shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        t("home.nextCheckin"),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary ml-1", children: nextCheckinText })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-4 grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/nearby", className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.55_0.16_145)] via-primary to-[var(--gold)] text-primary-foreground p-4 shadow-lg active:scale-[0.98] transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display leading-tight", children: t("home.nearby.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 text-xs mt-0.5", children: t("home.nearby.desc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/family", className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.55_0.18_295)] via-primary to-accent text-primary-foreground p-4 shadow-lg active:scale-[0.98] transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display leading-tight", children: t("home.familyView.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 text-xs mt-0.5", children: t("home.familyView.desc") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display mb-3", children: t("home.whatToDo") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: featureDefs.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: f.to, className: "group relative overflow-hidden rounded-2xl bg-card border border-border p-5 transition-all active:scale-95", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${f.tint} flex items-center justify-center text-white mb-3 shadow-sm`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-7 h-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: t(`home.f.${f.tKey}.title`) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: t(`home.f.${f.tKey}.desc`) })
      ] }, f.to)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-cream to-secondary p-5 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 fill-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: t("home") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: t("home.familyDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-accent border-2 border-card flex items-center justify-center text-sm font-semibold", children: t("home.son") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-[var(--gold)] border-2 border-card flex items-center justify-center text-sm font-semibold", children: t("home.daughter") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary text-primary-foreground border-2 border-card flex items-center justify-center text-sm font-semibold", children: t("home.grandchild") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ml-auto text-sm font-semibold text-primary flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
          " ",
          t("home.share")
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Home as component
};
