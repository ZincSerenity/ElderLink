import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, G as Gift, C as Clock } from "../_libs/lucide-react.mjs";
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
function RewardsPage() {
  const {
    t,
    lang
  } = useLang();
  const {
    user
  } = useAuth();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "w-11 h-11 rounded-full bg-secondary flex items-center justify-center transition active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("rw.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("rw.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-[var(--gold)] to-accent p-5 text-accent-foreground flex items-center justify-between shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium opacity-90", children: t("rw.points") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-display mt-1", children: [
          totalPoints.toLocaleString(),
          " ",
          t("rw.unit")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "w-8 h-8 text-accent-foreground" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-8 flex-1 flex flex-col items-center justify-center text-center py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display text-foreground", children: lang === "zh" ? "禮品換領功能即將推出" : "Rewards Center Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-[280px] text-sm leading-relaxed", children: lang === "zh" ? "我們的團隊正努力為您接洽各大超市及日常用品商戶！現在玩遊戲及打卡累積的積分將會安全保留，敬請期待。" : "We are currently setting up partnerships with supermarket stores. All points you earn now from games and daily check-ins are securely saved!" })
    ] })
  ] });
}
export {
  RewardsPage as component
};
