import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Users, AlertTriangle, CheckCircle2, MessageCircle, Link2, Clock } from "lucide-react";

export const Route = createFileRoute("/family")({ component: FamilyPage });

type Row = {
  id: string;
  display_name: string | null;
  last_checkin: string | null;
  unread: number;
};

const MISSED_HOUR = 14; // alert if no check-in by 2pm

function FamilyPage() {
  const { lang } = useLang();
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) { setBusy(false); return; }
    let alive = true;
    (async () => {
      setBusy(true);
      const { data: links } = await supabase
        .from("family_links")
        .select("watched_id")
        .eq("watcher_id", user.id);

      const ids = (links ?? []).map((l) => l.watched_id);
      if (ids.length === 0) { if (alive) { setRows([]); setBusy(false); } return; }

      const { data: profs } = await supabase
        .from("profiles").select("id, display_name").in("id", ids);

      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);

      const enriched: Row[] = await Promise.all(ids.map(async (id) => {
        const prof = profs?.find((p) => p.id === id);
        const [{ data: ci }, { count }] = await Promise.all([
          supabase.from("checkins").select("created_at").eq("user_id", id)
            .gte("created_at", startOfDay.toISOString())
            .order("created_at", { ascending: false }).limit(1).maybeSingle(),
          supabase.from("messages").select("*", { count: "exact", head: true })
            .eq("sender_id", id).eq("recipient_id", user.id).is("read_at", null),
        ]);
        return { id, display_name: prof?.display_name ?? null, last_checkin: ci?.created_at ?? null, unread: count ?? 0 };
      }));

      if (alive) { setRows(enriched); setBusy(false); }
    })();
    return () => { alive = false; };
  }, [user]);

  if (loading) return <AppShell><div className="p-6 text-muted-foreground">…</div></AppShell>;

  if (!user) {
    return (
      <AppShell>
        <section className="px-5 pt-10 text-center">
          <Users className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-2xl font-display mt-3">{lang === "zh" ? "家人版" : "Family view"}</h1>
          <p className="text-muted-foreground mt-2">
            {lang === "zh" ? "請先登入查看屋企人嘅打卡同訊息" : "Sign in to see your family's check-ins and messages"}
          </p>
          <Link to="/auth" className="inline-block mt-5 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
            {lang === "zh" ? "登入" : "Sign in"}
          </Link>
        </section>
      </AppShell>
    );
  }

  const now = new Date();
  const missedToday = (last: string | null) => {
    if (!last) return now.getHours() >= MISSED_HOUR;
    return false;
  };

  return (
    <AppShell>
      <section className="px-5 pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display">{lang === "zh" ? "屋企人" : "Family"}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === "zh" ? "睇下佢哋今日點" : "See how they're doing today"}
          </p>
        </div>
        <Link to="/link" className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold shadow-sm">
          <Link2 className="w-4 h-4" /> {lang === "zh" ? "連結" : "Link"}
        </Link>
      </section>

      <section className="px-5 mt-5 space-y-3">
        {busy ? (
          <p className="text-muted-foreground">{lang === "zh" ? "載入緊…" : "Loading…"}</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="font-display text-xl">{lang === "zh" ? "仲未連結到屋企人" : "No family linked yet"}</p>
            <p className="text-muted-foreground mt-1">
              {lang === "zh" ? "用邀請碼連結，雙方都可以發起" : "Use an invite code — either side can start"}
            </p>
            <Link to="/link" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold">
              {lang === "zh" ? "去連結" : "Get linked"}
            </Link>
          </div>
        ) : rows.map((r) => {
          const missed = missedToday(r.last_checkin);
          return (
            <Link
              key={r.id}
              to="/family/$userId"
              params={{ userId: r.id }}
              className="block rounded-3xl bg-card border border-border p-4 active:scale-[0.99] transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display text-2xl shrink-0 ${missed ? "bg-destructive" : "bg-primary"}`}>
                  {(r.display_name ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{r.display_name ?? (lang === "zh" ? "未命名" : "Unnamed")}</p>
                  {r.last_checkin ? (
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {lang === "zh" ? "今日已打卡 · " : "Checked in today · "}
                      {new Date(r.last_checkin).toLocaleTimeString(lang === "zh" ? "zh-HK" : "en", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  ) : missed ? (
                    <p className="text-destructive text-sm flex items-center gap-1.5 mt-0.5 font-semibold">
                      <AlertTriangle className="w-4 h-4" />
                      {lang === "zh" ? "今日未打卡" : "No check-in today"}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4" />
                      {lang === "zh" ? "等緊今日打卡" : "Awaiting today's check-in"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {r.unread > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full px-2 py-0.5 min-w-5 text-center">
                      {r.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </AppShell>
  );
}
