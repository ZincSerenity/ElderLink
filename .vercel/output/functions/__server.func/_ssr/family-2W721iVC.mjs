import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import "../_libs/sonner.mjs";
import { k as Users, i as Link2, b as CircleCheck, l as TriangleAlert, C as Clock, M as MessageCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const MISSED_HOUR = 14;
function FamilyPage() {
  const {
    lang
  } = useLang();
  const {
    user,
    loading
  } = useAuth();
  const [rows, setRows] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) {
      setBusy(false);
      return;
    }
    let alive = true;
    (async () => {
      setBusy(true);
      const {
        data: links
      } = await supabase.from("family_links").select("watched_id").eq("watcher_id", user.id);
      const ids = (links ?? []).map((l) => l.watched_id);
      if (ids.length === 0) {
        if (alive) {
          setRows([]);
          setBusy(false);
        }
        return;
      }
      const {
        data: profs
      } = await supabase.from("profiles").select("id, display_name").in("id", ids);
      const startOfDay = /* @__PURE__ */ new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const enriched = await Promise.all(ids.map(async (id) => {
        const prof = profs?.find((p) => p.id === id);
        const [{
          data: ci
        }, {
          count
        }] = await Promise.all([supabase.from("checkins").select("created_at").eq("user_id", id).gte("created_at", startOfDay.toISOString()).order("created_at", {
          ascending: false
        }).limit(1).maybeSingle(), supabase.from("messages").select("*", {
          count: "exact",
          head: true
        }).eq("sender_id", id).eq("recipient_id", user.id).is("read_at", null)]);
        return {
          id,
          display_name: prof?.display_name ?? null,
          last_checkin: ci?.created_at ?? null,
          unread: count ?? 0
        };
      }));
      if (alive) {
        setRows(enriched);
        setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-muted-foreground", children: "…" }) });
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 mx-auto text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display mt-3", children: lang === "zh" ? "家人版" : "Family view" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: lang === "zh" ? "請先登入查看屋企人嘅打卡同訊息" : "Sign in to see your family's check-ins and messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
        mode: "signin"
      }, className: "inline-block mt-5 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold", children: lang === "zh" ? "登入" : "Sign in" })
    ] }) });
  }
  const now = /* @__PURE__ */ new Date();
  const missedToday = (last) => {
    if (!last) return now.getHours() >= MISSED_HOUR;
    return false;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: lang === "zh" ? "屋企人" : "Family" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: lang === "zh" ? "睇下佢哋今日點" : "See how they're doing today" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/link", className: "flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
        " ",
        lang === "zh" ? "連結" : "Link"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-5 space-y-3", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: lang === "zh" ? "載入緊…" : "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: lang === "zh" ? "仲未連結到屋企人" : "No family linked yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: lang === "zh" ? "用邀請碼連結，雙方都可以發起" : "Use an invite code — either side can start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/link", className: "inline-block mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold", children: lang === "zh" ? "去連結" : "Get linked" })
    ] }) : rows.map((r) => {
      const missed = missedToday(r.last_checkin);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/family/$userId", params: {
        userId: r.id
      }, className: "block rounded-3xl bg-card border border-border p-4 active:scale-[0.99] transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display text-2xl shrink-0 ${missed ? "bg-destructive" : "bg-primary"}`, children: (r.display_name ?? "?").slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg truncate", children: r.display_name ?? (lang === "zh" ? "未命名" : "Unnamed") }),
          r.last_checkin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
            lang === "zh" ? "今日已打卡 · " : "Checked in today · ",
            new Date(r.last_checkin).toLocaleTimeString(lang === "zh" ? "zh-HK" : "en", {
              hour: "2-digit",
              minute: "2-digit"
            })
          ] }) : missed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-destructive text-sm flex items-center gap-1.5 mt-0.5 font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
            lang === "zh" ? "今日未打卡" : "No check-in today"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
            lang === "zh" ? "等緊今日打卡" : "Awaiting today's check-in"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-primary" }),
          r.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-destructive text-destructive-foreground text-xs font-bold rounded-full px-2 py-0.5 min-w-5 text-center", children: r.unread })
        ] })
      ] }) }, r.id);
    }) })
  ] });
}
export {
  FamilyPage as component
};
