import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Mic, Utensils, Dumbbell, Trees, Droplet, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/ai")({ component: AIPage });

type TopicDef = {
  key: string;
  icon: typeof Utensils;
  color: string;
};

const topicDefs: TopicDef[] = [
  { key: "food", icon: Utensils, color: "from-[oklch(0.7_0.18_30)] to-[var(--gold)]" },
  { key: "exercise", icon: Dumbbell, color: "from-[oklch(0.65_0.15_145)] to-[oklch(0.75_0.15_145)]" },
  { key: "park", icon: Trees, color: "from-[oklch(0.6_0.15_180)] to-[oklch(0.7_0.15_180)]" },
  { key: "water", icon: Droplet, color: "from-[oklch(0.65_0.15_240)] to-[oklch(0.75_0.15_240)]" },
];

type Msg = { me: boolean; text: string };

function AIPage() {
  const { t } = useLang();
  const [input, setInput] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [listening, setListening] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const active = topicDefs.find((d) => d.key === activeKey) ?? null;

  const openTopic = (d: TopicDef) => {
    setActiveKey(d.key);
    setMessages([
      { me: true, text: t(`ai.${d.key}Prompt`) },
      { me: false, text: t(`ai.${d.key}Reply`) },
    ]);
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { me: true, text: value }]);
    setInput("");
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { me: false, text: t("ai.thinking") }]);
    }, 900);
  };

  const startVoice = () => {
    setListening(true);
    timerRef.current = setTimeout(() => {
      setListening(false);
      if (!active) openTopic(topicDefs[0]);
      send(t("ai.voiceSample"));
    }, 1600);
  };

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.18_280)] to-primary flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display">{t("ai.title")}</h1>
            <p className="text-muted-foreground">{t("ai.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="grid grid-cols-2 gap-3">
          {topicDefs.map((d) => (
            <button
              key={d.key}
              onClick={() => openTopic(d)}
              className={`relative overflow-hidden rounded-3xl p-5 text-left text-white shadow-md active:scale-[0.97] transition bg-gradient-to-br ${d.color}`}
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/15" />
              <d.icon className="w-9 h-9" />
              <p className="text-2xl font-display mt-3">{t(`ai.${d.key}`)}</p>
              <p className="opacity-90 mt-1">{t(`ai.${d.key}Prompt`)}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <p className="font-semibold text-muted-foreground mb-3">{t("ai.askMore")}</p>
        <button
          onClick={startVoice}
          className="w-full bg-card border border-border rounded-3xl p-5 flex items-center gap-4 shadow-sm active:scale-[0.98] transition"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[var(--gold)] text-primary-foreground flex items-center justify-center shadow-md shrink-0">
            <Mic className="w-8 h-8" />
          </div>
          <div className="text-left">
            <p className="font-display text-xl">{t("ai.speakAsk")}</p>
            <p className="text-muted-foreground">{t("ai.speakHint")}</p>
          </div>
        </button>
      </section>

      {active && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${active.color} text-white flex items-center justify-center`}>
                <active.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-lg">{t(`ai.${active.key}`)}</p>
                <p className="text-xs text-muted-foreground">{t("ai.helper")}</p>
              </div>
            </div>
            <button onClick={() => { setActiveKey(null); setMessages([]); }} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-base ${m.me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 flex items-center gap-2 bg-card">
            <button
              onClick={startVoice}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${listening ? "bg-primary text-primary-foreground animate-pulse" : "bg-secondary"}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={listening ? t("ai.listening") : t("ai.askAgain")}
              className="flex-1 bg-secondary rounded-2xl px-4 py-3 text-base outline-none"
            />
            <button onClick={() => send()} className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
