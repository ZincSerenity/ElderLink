import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Link2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/link")({ component: LinkPage });

function LinkPage() {
  const { lang } = useLang();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [myCode, setMyCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<"watch" | "be_watched">("watch");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("invite_code").eq("id", user.id).maybeSingle()
      .then(({ data }) => setMyCode(data?.invite_code ?? null));
  }, [user]);

  async function redeem() {
    if (!code.trim()) return;
    setBusy(true);
    const { error } = await supabase.rpc("redeem_invite", {
      _code: code.trim().toUpperCase(), _direction: direction,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(lang === "zh" ? "已連結！" : "Linked!");
    navigate({ to: "/family" });
  }

  function copyCode() {
    if (!myCode) return;
    navigator.clipboard.writeText(myCode).then(() => toast.success(lang === "zh" ? "已複製" : "Copied"));
  }

  if (loading) return <AppShell><div className="p-6">…</div></AppShell>;
  if (!user) {
    return <AppShell><div className="p-6 text-center">
      <Link to="/auth" className="text-primary font-semibold">{lang === "zh" ? "請先登入" : "Sign in"}</Link>
    </div></AppShell>;
  }

  return (
    <AppShell>
      <section className="px-5 pt-6 flex items-center gap-3">
        <Link to="/family" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-display">{lang === "zh" ? "連結屋企人" : "Link family"}</h1>
      </section>

      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] text-primary-foreground p-6">
          <p className="opacity-90">{lang === "zh" ? "你嘅邀請碼" : "Your invite code"}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-4xl font-display tracking-widest">{myCode ?? "…"}</p>
            <button onClick={copyCode} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="opacity-90 mt-3 text-sm">
            {lang === "zh" ? "俾屋企人輸入呢個碼就可以連結" : "Share this code with family to link"}
          </p>
        </div>
      </section>

      <section className="px-5 mt-6">
        <p className="font-semibold text-muted-foreground mb-3">
          {lang === "zh" ? "或者輸入對方嘅邀請碼" : "Or enter their invite code"}
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={lang === "zh" ? "例如 AB12CD" : "e.g. AB12CD"}
          maxLength={6}
          className="w-full bg-card border border-border rounded-2xl px-4 py-4 text-2xl font-display tracking-widest text-center outline-none"
        />

        <div className="mt-4 grid grid-cols-1 gap-2">
          <button
            onClick={() => setDirection("watch")}
            className={`p-4 rounded-2xl border text-left transition ${direction === "watch" ? "bg-primary/5 border-primary" : "bg-card border-border"}`}
          >
            <p className="font-semibold">{lang === "zh" ? "我想睇佢嘅打卡同訊息" : "I want to watch over them"}</p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {lang === "zh" ? "家人版 — 對方係長者" : "Family view — they are the elderly user"}
            </p>
          </button>
          <button
            onClick={() => setDirection("be_watched")}
            className={`p-4 rounded-2xl border text-left transition ${direction === "be_watched" ? "bg-primary/5 border-primary" : "bg-card border-border"}`}
          >
            <p className="font-semibold">{lang === "zh" ? "我想佢睇我嘅打卡" : "I want them to watch over me"}</p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {lang === "zh" ? "你係長者，對方係家人" : "You are the elderly user, they are family"}
            </p>
          </button>
        </div>

        <button
          onClick={redeem}
          disabled={busy || code.length < 4}
          className="w-full mt-5 py-4 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Link2 className="w-5 h-5" /> {lang === "zh" ? "連結" : "Link"}
        </button>
      </section>
    </AppShell>
  );
}
