import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { H as House, a as Gamepad2, M as MessageCircle, S as Sparkles, b as CircleCheck, L as Languages, G as Gift, U as User, c as LogOut, d as LogIn } from "../_libs/lucide-react.mjs";
const logoIcon = new URL("../assets/icon.png", import.meta.url).href;
function AppShell({ children }) {
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const { data: checkins } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("checkins").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const { data: plays } = useQuery({
    queryKey: ["game_plays", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("game_plays").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
    enabled: !!user?.id
  });
  const totalPoints = reactExports.useMemo(() => {
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
    { to: "/", label: t("nav.home"), icon: House },
    { to: "/game", label: t("nav.game"), icon: Gamepad2 },
    { to: "/chat", label: t("nav.chat"), icon: MessageCircle },
    { to: "/ai", icon: Sparkles, label: t("nav.ai") },
    { to: "/checkin", label: t("nav.checkin"), icon: CircleCheck }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoIcon, alt: "ElderLink Logo", className: "w-full h-full object-cover" }) }),
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
            "aria-label": "Toggle language",
            className: "flex items-center gap-1.5 bg-secondary text-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("lang.toggle") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/rewards", className: "flex items-center gap-1.5 bg-gradient-to-br from-[var(--gold)] to-accent text-accent-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "w-5 h-5" }),
          totalPoints.toLocaleString()
        ] }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/account",
              title: "帳戶設定",
              className: "flex items-center justify-center w-10 h-10 bg-secondary text-foreground rounded-full shadow-sm active:scale-95 transition overflow-hidden",
              children: profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: "Avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: signOut,
              "aria-label": "Sign out",
              className: "flex items-center justify-center w-10 h-10 bg-secondary text-muted-foreground hover:text-red-500 rounded-full shadow-sm active:scale-95 transition",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/auth",
            search: { mode: "signin" },
            className: "flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "zh" ? "登入" : "Sign in" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 max-w-xl mx-auto w-full", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 max-w-xl mx-auto", children: tabs.map(({ to, label, icon: Icon }) => {
      const active = pathname === to;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          className: `flex flex-col items-center justify-center py-3 gap-1 transition-all ${active ? "text-primary" : "text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-primary/10 scale-105" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-7 h-7", strokeWidth: active ? 2.5 : 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold -mt-0.5 text-sm", children: label })
          ]
        },
        to
      );
    }) }) })
  ] });
}
export {
  AppShell as A
};
