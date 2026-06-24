import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Search, Plus, Shuffle, Sparkles, X, Send, Mic, Users, Heart, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/chat")({ component: ChatPage });

type Stage = "idle" | "matching" | "matched";
type Tab = "family" | "friend" | "groups";

type StrangerDef = { key: "chan" | "mui" | "wong" | "yuk"; age: number; fromKey: string; hobbyKey: string };

const strangers: StrangerDef[] = [
  { key: "chan", age: 72, fromKey: "kln", hobbyKey: "chess" },
  { key: "mui", age: 68, fromKey: "shatin", hobbyKey: "dance" },
  { key: "wong", age: 75, fromKey: "tsuen", hobbyKey: "mj" },
  { key: "yuk", age: 70, fromKey: "np", hobbyKey: "soup" },
];

type ChatDef = { key: string; timeKey: string; unread: number; color: string; cat: Tab };

const allChats: ChatDef[] = [
  { key: "grandSunny", timeKey: "afternoon", unread: 2, color: "bg-[oklch(0.7_0.18_320)]", cat: "family" },
  { key: "sonChun", timeKey: "afternoon2", unread: 0, color: "bg-[oklch(0.65_0.18_25)]", cat: "family" },
  { key: "dauMei", timeKey: "morning", unread: 1, color: "bg-[oklch(0.7_0.15_15)]", cat: "family" },
  { key: "lee", timeKey: "afternoon3", unread: 1, color: "bg-[var(--gold)]", cat: "friend" },
  { key: "cheung", timeKey: "yesterday", unread: 0, color: "bg-[oklch(0.65_0.15_145)]", cat: "friend" },
  { key: "wongtai", timeKey: "yesterday", unread: 0, color: "bg-[oklch(0.7_0.14_60)]", cat: "friend" },
  { key: "mahjong", timeKey: "afternoon4", unread: 3, color: "bg-primary", cat: "groups" },
  { key: "walk", timeKey: "morning2", unread: 0, color: "bg-accent", cat: "groups" },
  { key: "opera", timeKey: "dayBefore", unread: 0, color: "bg-[oklch(0.6_0.15_280)]", cat: "groups" },
];

const tabDefs: { key: Tab; icon: typeof Users }[] = [
  { key: "family", icon: Heart },
  { key: "friend", icon: UserRound },
  { key: "groups", icon: Users },
];

function ChatPage() {
  const { t } = useLang();
  const [stage, setStage] = useState<Stage>("idle");
  const [partner, setPartner] = useState<StrangerDef>(strangers[0]);
  const [messages, setMessages] = useState<{ me: boolean; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<Tab>("family");
  const [query, setQuery] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceHeard, setVoiceHeard] = useState("");

  useEffect(() => {
    if (stage !== "matching") return;
    const id = setTimeout(() => {
      const p = strangers[Math.floor(Math.random() * strangers.length)];
      setPartner(p);
      setMessages([{ me: false, text: `${t("chat.greeting")}${t(`chat.str.${p.key}`)}${t("chat.greetingTail")}` }]);
      setStage("matched");
    }, 1800);
    return () => clearTimeout(id);
  }, [stage, t]);

  useEffect(() => {
    if (!voiceOpen) return;
    setVoiceHeard("");
    const t1 = setTimeout(() => setVoiceHeard("…"), 600);
    const t2 = setTimeout(() => {
      setVoiceHeard(t("chat.c.grandSunny"));
      setQuery(t("chat.c.grandSunny"));
      setTab("family");
    }, 1500);
    const t3 = setTimeout(() => setVoiceOpen(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [voiceOpen, t]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { me: true, text: draft }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { me: false, text: t("chat.autoReply") }]);
    }, 1200);
  };

  const filtered = useMemo(
    () => allChats.filter((c) => {
      if (c.cat !== tab) return false;
      const q = query.trim();
      if (!q) return true;
      return t(`chat.c.${c.key}`).toLowerCase().includes(q.toLowerCase());
    }),
    [tab, query, t]
  );

  return (
    <AppShell>
      <section className="px-5 pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display">{t("chat.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("chat.subtitle")}</p>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Plus className="w-6 h-6" />
        </button>
      </section>

      <section className="px-5 mt-5">
        <button
          onClick={() => { setStage("matching"); setMessages([]); }}
          className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.6_0.2_30)] to-[var(--gold)] text-primary-foreground p-6 text-left shadow-lg active:scale-[0.98] transition"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15" />
          <div className="absolute right-4 top-4 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Shuffle className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <Sparkles className="w-4 h-4" /> {t("chat.tap")}
          </div>
          <p className="text-3xl font-display mt-1">{t("chat.meetNew")}</p>
          <p className="opacity-90 mt-1 max-w-[70%]">{t("chat.meetDesc")}</p>
        </button>
      </section>

      <section className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-2 bg-secondary rounded-2xl p-1.5">
          {tabDefs.map((td) => {
            const active = tab === td.key;
            return (
              <button
                key={td.key}
                onClick={() => setTab(td.key)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition ${active ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                <td.icon className="w-4 h-4" />
                {t(`chat.tab.${td.key}`)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 mt-4">
        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("chat.search")}
            className="bg-transparent outline-none flex-1"
          />
          <button
            onClick={() => setVoiceOpen(true)}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground mt-2 px-1">{t("chat.voiceTip")}</p>
      </section>

      <section className="mt-3">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">{t("chat.noResult")}</p>
        ) : (
          filtered.map((c) => {
            const name = t(`chat.c.${c.key}`);
            return (
              <button key={c.key} className="w-full flex items-center gap-3 px-5 py-3.5 active:bg-secondary transition-colors">
                <div className={`w-12 h-12 rounded-full ${c.color} text-white flex items-center justify-center font-semibold text-lg shrink-0`}>
                  {name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{name}</p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">{t(`chat.t.${c.timeKey}`)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-muted-foreground truncate">{t(`chat.m.${c.key}`)}</p>
                    {c.unread > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shrink-0">{c.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </section>

      {voiceOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center justify-center px-8 text-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/25 animate-ping" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-[var(--gold)] text-primary-foreground flex items-center justify-center shadow-lg">
              <Mic className="w-12 h-12" />
            </div>
          </div>
          <div>
            <p className="font-display text-2xl">{t("chat.listening")}</p>
            <p className="text-muted-foreground mt-2 min-h-6">{voiceHeard || t("chat.exampleVoice")}</p>
          </div>
          <button onClick={() => setVoiceOpen(false)} className="px-6 py-3 rounded-2xl bg-secondary font-semibold">
            {t("chat.cancel")}
          </button>
        </div>
      )}

      {stage !== "idle" && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              {stage === "matching" ? (
                <p className="font-display text-xl">{t("chat.finding")}</p>
              ) : (
                <>
                  <p className="font-display text-xl">{t(`chat.str.${partner.key}`)}</p>
                  <p className="text-muted-foreground">{partner.age} {t("chat.years")} · {t(`chat.str.from.${partner.fromKey}`)} · {t("chat.likes")} {t(`chat.str.hb.${partner.hobbyKey}`)}</p>
                </>
              )}
            </div>
            <button onClick={() => setStage("idle")} className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
              <X className="w-6 h-6" />
            </button>
          </div>

          {stage === "matching" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[var(--gold)] flex items-center justify-center text-primary-foreground shadow-lg">
                  <Shuffle className="w-10 h-10" />
                </div>
              </div>
              <p className="text-xl font-display">{t("chat.findingLong")}</p>
              <p className="text-muted-foreground">{t("chat.fewSec")}</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-base ${m.me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3 flex items-center gap-2 bg-card">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("chat.typeMsg")}
                  className="flex-1 bg-secondary rounded-2xl px-4 py-3 text-base outline-none"
                />
                <button onClick={send} className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <button onClick={() => { setStage("matching"); setMessages([]); }} className="mx-5 mb-3 py-3 rounded-xl bg-secondary font-semibold flex items-center justify-center gap-2">
                <Shuffle className="w-5 h-5" /> {t("chat.again")}
              </button>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}
