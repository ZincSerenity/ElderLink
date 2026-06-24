import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapPin, Radar, Send, X, MessageCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/nearby")({
  component: NearbyPage,
  head: () => ({
    meta: [
      { title: "Nearby — ElderLink" },
      { name: "description", content: "Find ElderLink seniors near you and start chatting in one tap." },
    ],
  }),
});

type PersonDef = {
  key: string;
  age: number;
  distance: number;
  placeKey: string;
  hobbyKey: string;
  color: string;
  online: boolean;
};

const pool: PersonDef[] = [
  { key: "chan", age: 72, distance: 80, placeKey: "park", hobbyKey: "chess", color: "bg-[oklch(0.65_0.18_25)]", online: true },
  { key: "mui", age: 68, distance: 150, placeKey: "cafe", hobbyKey: "flower", color: "bg-[oklch(0.7_0.18_320)]", online: true },
  { key: "wong", age: 75, distance: 230, placeKey: "lobby", hobbyKey: "opera", color: "bg-[var(--gold)]", online: false },
  { key: "yuk", age: 70, distance: 320, placeKey: "market", hobbyKey: "soup", color: "bg-[oklch(0.65_0.15_145)]", online: true },
  { key: "keung", age: 78, distance: 480, placeKey: "bus", hobbyKey: "news", color: "bg-[oklch(0.6_0.15_280)]", online: true },
  { key: "lin", age: 71, distance: 620, placeKey: "pavilion", hobbyKey: "dance", color: "bg-[oklch(0.7_0.14_60)]", online: false },
];

function NearbyPage() {
  const { t } = useLang();
  const [scanning, setScanning] = useState(true);
  const [people, setPeople] = useState<PersonDef[]>([]);
  const [active, setActive] = useState<PersonDef | null>(null);
  const [messages, setMessages] = useState<{ me: boolean; text: string }[]>([]);
  const [draft, setDraft] = useState("");

  const scan = () => {
    setScanning(true);
    setPeople([]);
  };

  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(() => {
      setPeople([...pool].sort((a, b) => a.distance - b.distance));
      setScanning(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [scanning]);

  const openChat = (p: PersonDef) => {
    setActive(p);
    setMessages([{ me: false, text: `${t("nb.greeting1")}${t(`nb.p.${p.key}`)}${t("nb.greeting2")}${t(`nb.pl.${p.placeKey}`)}${t("nb.greeting3")}` }]);
  };

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { me: true, text: draft }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { me: false, text: t("nb.autoReply") }]);
    }, 1100);
  };

  const distLabel = (m: number) =>
    m < 1000 ? `${m} ${t("nb.m")}` : `${(m / 1000).toFixed(1)} ${t("nb.km")}`;

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <h1 className="text-3xl font-display">{t("nb.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("nb.subtitle")}</p>
      </section>

      <section className="px-5 mt-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.6_0.18_30)] to-[var(--gold)] text-primary-foreground p-6 shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15" />
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <p className="opacity-90">{t("nb.youAt")}</p>
              <p className="text-2xl font-display">{t("nb.location")}</p>
            </div>
          </div>
          <button
            onClick={scan}
            disabled={scanning}
            className="mt-5 inline-flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-full font-semibold disabled:opacity-70"
          >
            {scanning ? <Radar className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {scanning ? t("nb.searching") : t("nb.again")}
          </button>
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-2xl font-display mb-3">{scanning ? t("nb.searchingTitle") : `${t("nb.foundPrefix")}${people.length}${t("nb.foundSuffix")}`}</h2>

        {scanning ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-primary/20 animate-ping [animation-delay:0.4s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Radar className="w-8 h-8" />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{t("nb.fewSec")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {people.map((p) => {
              const name = t(`nb.p.${p.key}`);
              return (
                <div key={p.key} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4">
                  <div className={`relative w-14 h-14 rounded-full ${p.color} text-white flex items-center justify-center font-semibold text-xl shrink-0`}>
                    {name.slice(0, 1)}
                    {p.online && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[oklch(0.7_0.18_145)] border-2 border-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg">{name} <span className="text-muted-foreground font-normal">· {p.age} {t("nb.years")}</span></p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {distLabel(p.distance)} · {t(`nb.pl.${p.placeKey}`)}
                    </p>
                    <p className="text-sm mt-0.5">{t("nb.likes")} {t(`nb.hb.${p.hobbyKey}`)}</p>
                  </div>
                  <button
                    onClick={() => openChat(p)}
                    className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("nb.chat")}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="px-5 mt-6">
        <div className="bg-secondary rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t("nb.privacyLabel")}</span>
            {t("nb.privacy")}
          </p>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-12 h-12 rounded-full ${active.color} text-white flex items-center justify-center font-semibold text-lg shrink-0`}>
                {t(`nb.p.${active.key}`).slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl">{t(`nb.p.${active.key}`)}</p>
                <p className="text-sm text-muted-foreground truncate">
                  <MapPin className="inline w-3.5 h-3.5" /> {distLabel(active.distance)} · {t(`nb.pl.${active.placeKey}`)}
                </p>
              </div>
            </div>
            <button onClick={() => setActive(null)} className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

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
              placeholder={t("nb.typeMsg")}
              className="flex-1 bg-secondary rounded-2xl px-4 py-3 text-base outline-none"
            />
            <button onClick={send} className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
