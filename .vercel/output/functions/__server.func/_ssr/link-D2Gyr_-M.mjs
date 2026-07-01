import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ArrowLeft, h as Copy, i as Link2 } from "../_libs/lucide-react.mjs";
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
function LinkPage() {
  const {
    lang
  } = useLang();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [myCode, setMyCode] = reactExports.useState(null);
  const [code, setCode] = reactExports.useState("");
  const [direction, setDirection] = reactExports.useState("watch");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("invite_code").eq("id", user.id).maybeSingle().then(({
      data
    }) => setMyCode(data?.invite_code ?? null));
  }, [user]);
  async function redeem() {
    if (!code.trim()) return;
    setBusy(true);
    const {
      error
    } = await supabase.rpc("redeem_invite", {
      _code: code.trim().toUpperCase(),
      _direction: direction
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(lang === "zh" ? "已連結！" : "Linked!");
    navigate({
      to: "/family"
    });
  }
  function copyCode() {
    if (!myCode) return;
    navigator.clipboard.writeText(myCode).then(() => toast.success(lang === "zh" ? "已複製" : "Copied"));
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: "…" }) });
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "text-primary font-semibold", children: lang === "zh" ? "請先登入" : "Sign in" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/family", className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display", children: lang === "zh" ? "連結屋企人" : "Link family" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] text-primary-foreground p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90", children: lang === "zh" ? "你嘅邀請碼" : "Your invite code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-display tracking-widest", children: myCode ?? "…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: copyCode, className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 mt-3 text-sm", children: lang === "zh" ? "俾屋企人輸入呢個碼就可以連結" : "Share this code with family to link" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground mb-3", children: lang === "zh" ? "或者輸入對方嘅邀請碼" : "Or enter their invite code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: lang === "zh" ? "例如 AB12CD" : "e.g. AB12CD", maxLength: 6, className: "w-full bg-card border border-border rounded-2xl px-4 py-4 text-2xl font-display tracking-widest text-center outline-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-1 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDirection("watch"), className: `p-4 rounded-2xl border text-left transition ${direction === "watch" ? "bg-primary/5 border-primary" : "bg-card border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: lang === "zh" ? "我想睇佢嘅打卡同訊息" : "I want to watch over them" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: lang === "zh" ? "家人版 — 對方係長者" : "Family view — they are the elderly user" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDirection("be_watched"), className: `p-4 rounded-2xl border text-left transition ${direction === "be_watched" ? "bg-primary/5 border-primary" : "bg-card border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: lang === "zh" ? "我想佢睇我嘅打卡" : "I want them to watch over me" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: lang === "zh" ? "你係長者，對方係家人" : "You are the elderly user, they are family" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: redeem, disabled: busy || code.length < 4, className: "w-full mt-5 py-4 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-5 h-5" }),
        " ",
        lang === "zh" ? "連結" : "Link"
      ] })
    ] })
  ] });
}
export {
  LinkPage as component
};
