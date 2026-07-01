import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$4, u as useLang, s as supabase } from "./router-FEBAZNos.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ArrowLeft, t as Mail, u as Phone, j as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
const logoIcon = new URL("../assets/icon.png", import.meta.url).href;
function AuthPage() {
  const navigate = useNavigate();
  const search = Route$4.useSearch();
  const {
    lang
  } = useLang();
  const [mode, setMode] = reactExports.useState(() => {
    if (typeof window === "undefined") return search.mode;
    const urlMode = new URLSearchParams(window.location.search).get("mode");
    return urlMode === "signup" ? "signup" : search.mode;
  });
  const [method, setMethod] = reactExports.useState("email");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const tr = (zh, en) => lang === "zh" ? zh : en;
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/"
      });
    });
  }, [navigate]);
  reactExports.useEffect(() => {
    const urlMode = new URLSearchParams(window.location.search).get("mode");
    setMode(urlMode === "signup" ? "signup" : search.mode);
  }, [search.mode]);
  async function handleEmail(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: name || email.split("@")[0]
            }
          }
        });
        if (error) throw error;
        toast.success(tr("註冊成功！", "Sign up successful!"));
        navigate({
          to: "/"
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success(tr("歡迎返嚟！", "Welcome back!"));
        navigate({
          to: "/"
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        toast.success(tr("登入成功！", "Signed in!"));
        navigate({
          to: "/"
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col px-5 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-muted-foreground mb-6 self-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tr("返回", "Back") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center shadow-md mb-3 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoIcon, alt: "ElderLink Logo", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: mode === "signin" ? tr("登入", "Sign in") : tr("註冊", "Sign up") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-lg", children: tr("歡迎來到 ElderLink", "Welcome to ElderLink") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-5 bg-secondary p-1 rounded-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setMethod("email"), className: `py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${method === "email" ? "bg-card shadow" : "text-muted-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5" }),
          " ",
          tr("電郵", "Email")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setMethod("phone"), className: `py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${method === "phone" ? "bg-card shadow" : "text-muted-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5" }),
          " ",
          tr("電話", "Phone")
        ] })
      ] }),
      method === "email" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "space-y-3", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: tr("你個名（例如：王伯伯）", "Your name"), className: "w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: tr("電郵", "Email"), className: "w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: tr("密碼（至少 6 個字）", "Password (min 6 chars)"), className: "w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-md active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }),
          mode === "signin" ? tr("登入", "Sign in") : tr("註冊", "Sign up")
        ] })
      ] }),
      method === "phone" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 space-y-3 bg-card border border-border rounded-2xl p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-7 h-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: tr("手機驗證即將推出", "Phone login coming soon") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground px-4 text-sm leading-relaxed", children: tr("請先用電郵或 Google 登入", "Please sign in with Email or Google for now") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: tr("或者", "or") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleGoogle, disabled: loading, className: "w-full py-4 rounded-2xl bg-card border-2 border-border font-semibold text-lg shadow-sm active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", "aria-hidden": true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" })
        ] }),
        tr("用 Google 登入", "Continue with Google")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "text-primary font-semibold text-lg", children: mode === "signin" ? tr("仲未有戶口？立即註冊", "No account? Sign up") : tr("已經有戶口？返去登入", "Have an account? Sign in") }) })
    ] })
  ] });
}
export {
  AuthPage as component
};
