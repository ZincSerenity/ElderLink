import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/family/$userId")({ component: FamilyThread });

type Msg = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string; read_at: string | null };
type Checkin = { id: string; kind: string; created_at: string; note: string | null };

function FamilyThread() {
  const { userId } = Route.useParams();
  const { lang } = useLang();
  const { user } = useAuth();
  const [name, setName] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{ data: prof }, { data: m }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
        supabase.from("messages").select("*")
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
          .order("created_at", { ascending: true }).limit(200),
        supabase.from("checkins").select("id,kind,created_at,note")
          .eq("user_id", userId).order("created_at", { ascending: false }).limit(7),
      ]);
      if (!alive) return;
      setName(prof?.display_name ?? null);
      setMsgs((m ?? []) as Msg[]);
      setCheckins((c ?? []) as Checkin[]);
      // mark received as read
      await supabase.from("messages").update({ read_at: new Date().toISOString() })
        .eq("sender_id", userId).eq("recipient_id", user.id).is("read_at", null);
    })();

    const ch = supabase
      .channel(`thread:${user.id}:${userId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
        const row = p.new as Msg;
        const involved =
          (row.sender_id === user.id && row.recipient_id === userId) ||
          (row.sender_id === userId && row.recipient_id === user.id);
        if (involved) setMsgs((prev) => [...prev, row]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "checkins", filter: `user_id=eq.${userId}` }, (p) => {
        setCheckins((prev) => [p.new as Checkin, ...prev].slice(0, 7));
      })
      .subscribe();

    return () => { alive = false; supabase.removeChannel(ch); };
  }, [user, userId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send() {
    if (!body.trim() || !user || sending) return;
    setSending(true);
    const text = body.trim();
    setBody("");
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id, recipient_id: userId, body: text,
    });
    if (error) setBody(text);
    setSending(false);
  }

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
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display truncate">{name ?? (lang === "zh" ? "屋企人" : "Family")}</h1>
        </div>
      </section>

      <section className="px-5 mt-4">
        <p className="font-semibold text-muted-foreground mb-2">{lang === "zh" ? "近期打卡" : "Recent check-ins"}</p>
        {checkins.length === 0 ? (
          <p className="text-muted-foreground text-sm">{lang === "zh" ? "暫時冇打卡記錄" : "No check-ins yet"}</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {checkins.map((c) => (
              <div key={c.id} className="shrink-0 rounded-2xl bg-card border border-border px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{c.kind}</p>
                  <p className="text-sm font-semibold">
                    {new Date(c.created_at).toLocaleString(lang === "zh" ? "zh-HK" : "en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 mt-5 space-y-2 pb-32">
        {msgs.map((m) => {
          const mine = m.sender_id === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${mine ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={`text-[11px] mt-1 ${mine ? "opacity-80" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString(lang === "zh" ? "zh-HK" : "en", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </section>

      <div className="fixed bottom-20 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-xl mx-auto px-3 py-3 flex items-center gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder={lang === "zh" ? "講句嘢…" : "Say something…"}
            className="flex-1 bg-card border border-border rounded-full px-4 py-3 outline-none"
          />
          <button onClick={send} disabled={!body.trim() || sending} className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-60">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
