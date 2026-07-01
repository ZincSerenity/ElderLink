import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { b as Route, u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, b as CircleCheck, g as Send } from "../_libs/lucide-react.mjs";
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
function FamilyThread() {
  const {
    userId
  } = Route.useParams();
  const {
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  const [name, setName] = reactExports.useState(null);
  const [msgs, setMsgs] = reactExports.useState([]);
  const [checkins, setCheckins] = reactExports.useState([]);
  const [body, setBody] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const endRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{
        data: prof
      }, {
        data: m
      }, {
        data: c
      }] = await Promise.all([supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(), supabase.from("messages").select("*").or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`).order("created_at", {
        ascending: true
      }).limit(200), supabase.from("checkins").select("id,kind,created_at,note").eq("user_id", userId).order("created_at", {
        ascending: false
      }).limit(7)]);
      if (!alive) return;
      setName(prof?.display_name ?? null);
      setMsgs(m ?? []);
      setCheckins(c ?? []);
      await supabase.from("messages").update({
        read_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("sender_id", userId).eq("recipient_id", user.id).is("read_at", null);
    })();
    const ch = supabase.channel(`thread:${user.id}:${userId}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages"
    }, (p) => {
      const row = p.new;
      const involved = row.sender_id === user.id && row.recipient_id === userId || row.sender_id === userId && row.recipient_id === user.id;
      if (involved) setMsgs((prev) => [...prev, row]);
    }).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "checkins",
      filter: `user_id=eq.${userId}`
    }, (p) => {
      setCheckins((prev) => [p.new, ...prev].slice(0, 7));
    }).subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, [user, userId]);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [msgs]);
  async function send() {
    if (!body.trim() || !user || sending) return;
    setSending(true);
    const text = body.trim();
    setBody("");
    const {
      error
    } = await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: userId,
      body: text
    });
    if (error) setBody(text);
    setSending(false);
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "text-primary font-semibold", children: lang === "zh" ? "請先登入" : "Sign in" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/family", className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display truncate", children: name ?? (lang === "zh" ? "屋企人" : "Family") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground mb-2", children: lang === "zh" ? "近期打卡" : "Recent check-ins" }),
      checkins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: lang === "zh" ? "暫時冇打卡記錄" : "No check-ins yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: checkins.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 rounded-2xl bg-card border border-border px-3 py-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.kind }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: new Date(c.created_at).toLocaleString(lang === "zh" ? "zh-HK" : "en", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-5 space-y-2 pb-32", children: [
      msgs.map((m) => {
        const mine = m.sender_id === user.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${mine ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-2xl px-4 py-2.5 ${mine ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap break-words", children: m.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[11px] mt-1 ${mine ? "opacity-80" : "text-muted-foreground"}`, children: new Date(m.created_at).toLocaleTimeString(lang === "zh" ? "zh-HK" : "en", {
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] }) }, m.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto px-3 py-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: body, onChange: (e) => setBody(e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter") send();
      }, placeholder: lang === "zh" ? "講句嘢…" : "Say something…", className: "flex-1 bg-card border border-border rounded-full px-4 py-3 outline-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: send, disabled: !body.trim() || sending, className: "w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5" }) })
    ] }) })
  ] });
}
export {
  FamilyThread as component
};
