import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/local_client";
import { lovable } from "@/integrations/lovable/index";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { Mail, Phone, ArrowLeft, Loader2 } from "lucide-react";

type Mode = "signin" | "signup";
type Method = "email" | "phone";

// 使用原生路徑解析，避免 TypeScript TS2307 靜態資產錯誤
const logoIcon = new URL("../assets/icon.png", import.meta.url).href;

export const Route = createFileRoute("/auth")({
  // 精準約束回傳的物件型別，徹底解決 TS2345 寬鬆字串錯誤
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search.mode === "signup" ? "signup" : "signin",
  }),
  head: () => ({
    meta: [
      { title: "登入 / 註冊 — ElderLink" },
      { name: "description", content: "Sign in or sign up to ElderLink" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { lang } = useLang();
  
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return search.mode;
    const urlMode = new URLSearchParams(window.location.search).get("mode");
    return urlMode === "signup" ? "signup" : search.mode;
  });
  
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const tr = (zh: string, en: string) => (lang === "zh" ? zh : en);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  useEffect(() => {
    const urlMode = new URLSearchParams(window.location.search).get("mode");
    setMode(urlMode === "signup" ? "signup" : search.mode);
  }, [search.mode]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success(tr("註冊成功！", "Sign up successful!"));
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(tr("歡迎返嚟！", "Welcome back!"));
        navigate({ to: "/" });
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
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        toast.success(tr("登入成功！", "Signed in!"));
        navigate({ to: "/" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 py-6">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground mb-6 self-start">
        <ArrowLeft className="w-5 h-5" />
        <span>{tr("返回", "Back")}</span>
      </Link>

      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          {/* 精緻圓形紅白品牌標誌 */}
          <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center shadow-md mb-3 overflow-hidden">
            <img src={logoIcon} alt="ElderLink Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-3xl">{mode === "signin" ? tr("登入", "Sign in") : tr("註冊", "Sign up")}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{tr("歡迎來到 ElderLink", "Welcome to ElderLink")}</p>
        </div>

        {/* 登入渠道切換 */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-secondary p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${method === "email" ? "bg-card shadow" : "text-muted-foreground"}`}
          >
            <Mail className="w-5 h-5" /> {tr("電郵", "Email")}
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${method === "phone" ? "bg-card shadow" : "text-muted-foreground"}`}
          >
            <Phone className="w-5 h-5" /> {tr("電話", "Phone")}
          </button>
        </div>

        {method === "email" && (
          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr("你個名（例如：王伯伯）", "Your name")}
                className="w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr("電郵", "Email")}
              className="w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tr("密碼（至少 6 個字）", "Password (min 6 chars)")}
              className="w-full px-4 py-4 rounded-2xl bg-secondary border border-border text-lg outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-md active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === "signin" ? tr("登入", "Sign in") : tr("註冊", "Sign up")}
            </button>
          </form>
        )}

        {method === "phone" && (
          <div className="text-center py-8 space-y-3 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center">
              <Phone className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{tr("手機驗證即將推出", "Phone login coming soon")}</h3>
            <p className="text-muted-foreground px-4 text-sm leading-relaxed">{tr("請先用電郵或 Google 登入", "Please sign in with Email or Google for now")}</p>
          </div>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">{tr("或者", "or")}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* 第三方 Google 快捷登入 */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-card border-2 border-border font-semibold text-lg shadow-sm active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          {tr("用 Google 登入", "Continue with Google")}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary font-semibold text-lg"
          >
            {mode === "signin"
              ? tr("仲未有戶口？立即註冊", "No account? Sign up")
              : tr("已經有戶口？返去登入", "Have an account? Sign in")}
          </button>
        </div>
      </div>
    </div>
  );
}