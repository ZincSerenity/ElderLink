import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang } from "./router-FEBAZNos.mjs";
import "../_libs/sonner.mjs";
import { e as MapPin, R as Radar, f as RefreshCw, M as MessageCircle, X, g as Send } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const pool = [{
  key: "chan",
  age: 72,
  distance: 80,
  placeKey: "park",
  hobbyKey: "chess",
  color: "bg-[oklch(0.65_0.18_25)]",
  online: true
}, {
  key: "mui",
  age: 68,
  distance: 150,
  placeKey: "cafe",
  hobbyKey: "flower",
  color: "bg-[oklch(0.7_0.18_320)]",
  online: true
}, {
  key: "wong",
  age: 75,
  distance: 230,
  placeKey: "lobby",
  hobbyKey: "opera",
  color: "bg-[var(--gold)]",
  online: false
}, {
  key: "yuk",
  age: 70,
  distance: 320,
  placeKey: "market",
  hobbyKey: "soup",
  color: "bg-[oklch(0.65_0.15_145)]",
  online: true
}, {
  key: "keung",
  age: 78,
  distance: 480,
  placeKey: "bus",
  hobbyKey: "news",
  color: "bg-[oklch(0.6_0.15_280)]",
  online: true
}, {
  key: "lin",
  age: 71,
  distance: 620,
  placeKey: "pavilion",
  hobbyKey: "dance",
  color: "bg-[oklch(0.7_0.14_60)]",
  online: false
}];
function NearbyPage() {
  const {
    t
  } = useLang();
  const [scanning, setScanning] = reactExports.useState(true);
  const [people, setPeople] = reactExports.useState([]);
  const [active, setActive] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [draft, setDraft] = reactExports.useState("");
  const scan = () => {
    setScanning(true);
    setPeople([]);
  };
  reactExports.useEffect(() => {
    if (!scanning) return;
    const t2 = setTimeout(() => {
      setPeople([...pool].sort((a, b) => a.distance - b.distance));
      setScanning(false);
    }, 1800);
    return () => clearTimeout(t2);
  }, [scanning]);
  const openChat = (p) => {
    setActive(p);
    setMessages([{
      me: false,
      text: `${t("nb.greeting1")}${t(`nb.p.${p.key}`)}${t("nb.greeting2")}${t(`nb.pl.${p.placeKey}`)}${t("nb.greeting3")}`
    }]);
  };
  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, {
      me: true,
      text: draft
    }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        me: false,
        text: t("nb.autoReply")
      }]);
    }, 1100);
  };
  const distLabel = (m) => m < 1e3 ? `${m} ${t("nb.m")}` : `${(m / 1e3).toFixed(1)} ${t("nb.km")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("nb.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: t("nb.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.6_0.18_30)] to-[var(--gold)] text-primary-foreground p-6 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-7 h-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90", children: t("nb.youAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display", children: t("nb.location") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: scan, disabled: scanning, className: "mt-5 inline-flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-full font-semibold disabled:opacity-70", children: [
        scanning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5" }),
        scanning ? t("nb.searching") : t("nb.again")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display mb-3", children: scanning ? t("nb.searchingTitle") : `${t("nb.foundPrefix")}${people.length}${t("nb.foundSuffix")}` }),
      scanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-32", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-primary/15 animate-ping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-4 rounded-full bg-primary/20 animate-ping [animation-delay:0.4s]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "w-8 h-8" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("nb.fewSec") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: people.map((p) => {
        const name = t(`nb.p.${p.key}`);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card border border-border rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative w-14 h-14 rounded-full ${p.color} text-white flex items-center justify-center font-semibold text-xl shrink-0`, children: [
            name.slice(0, 1),
            p.online && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[oklch(0.7_0.18_145)] border-2 border-card" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-lg", children: [
              name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                "· ",
                p.age,
                " ",
                t("nb.years")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
              distLabel(p.distance),
              " · ",
              t(`nb.pl.${p.placeKey}`)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-0.5", children: [
              t("nb.likes"),
              " ",
              t(`nb.hb.${p.hobbyKey}`)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openChat(p), className: "shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
            t("nb.chat")
          ] })
        ] }, p.key);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-secondary rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: t("nb.privacyLabel") }),
      t("nb.privacy")
    ] }) }) }),
    active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 bg-background flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-full ${active.color} text-white flex items-center justify-center font-semibold text-lg shrink-0`, children: t(`nb.p.${active.key}`).slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: t(`nb.p.${active.key}`) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground truncate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline w-3.5 h-3.5" }),
              " ",
              distLabel(active.distance),
              " · ",
              t(`nb.pl.${active.placeKey}`)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(null), className: "w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-3", children: messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.me ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] px-4 py-2.5 rounded-2xl text-base ${m.me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`, children: m.text }) }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-3 flex items-center gap-2 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft, onChange: (e) => setDraft(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: t("nb.typeMsg"), className: "flex-1 bg-secondary rounded-2xl px-4 py-3 text-base outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: send, className: "w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5" }) })
      ] })
    ] })
  ] });
}
export {
  NearbyPage as component
};
