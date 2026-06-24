import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, Bell, Flame, Sun, Moon, Camera, Send, X, Heart } from "lucide-react";
import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkin")({ component: CheckinPage });

async function persistCheckin(userId: string | undefined, kind: string, lang: "zh" | "en") {
  if (!userId) {
    toast.error(lang === "zh" ? "請先登入" : "Please sign in");
    return false;
  }
  const { error } = await supabase.from("checkins").insert({ user_id: userId, kind });
  if (error) { toast.error(error.message); return false; }
  toast.success(lang === "zh" ? "已打卡，屋企人睇到喇！" : "Checked in — family can see!");
  return true;
}

const familyKeys = [
  { key: "son", color: "bg-accent" },
  { key: "daughter", color: "bg-[var(--gold)]" },
  { key: "grand", color: "bg-[oklch(0.7_0.18_320)]" },
  { key: "dil", color: "bg-[oklch(0.65_0.15_145)]" },
];

function CheckinPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [noon, setNoon] = useState(true);
  const [evening, setEvening] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string[]>(["son", "daughter", "grand"]);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const days = lang === "zh" ? ["一", "二", "三", "四", "五", "六", "日"] : ["M", "T", "W", "T", "F", "S", "S"];
  const completed = [true, true, true, true, true, true, false];

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const toggle = (k: string) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const share = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPhoto(null);
      setNote("");
    }, 1800);
  };

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <h1 className="text-3xl font-display">{t("ci.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("ci.subtitle")}</p>
      </section>

      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] text-primary-foreground p-6 text-center">
          <Flame className="w-10 h-10 mx-auto text-[var(--gold)]" />
          <p className="text-5xl font-display mt-2">7 <span className="text-2xl">{t("ci.streakUnit")}</span></p>
          <p className="opacity-90 mt-1">{t("ci.streakMsg")}</p>
          <div className="flex justify-between mt-5">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${completed[i] ? "bg-[var(--gold)] text-primary" : "bg-white/15"}`}>
                  {completed[i] ? "✓" : d}
                </div>
                <span className="text-xs opacity-80">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <p className="font-semibold text-muted-foreground mb-3">{t("ci.today")}</p>
        <div className="space-y-3">
          <button
            onClick={async () => { if (!noon) { const ok = await persistCheckin(user?.id, "noon", lang); if (ok) setNoon(true); } }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition ${noon ? "bg-primary/5 border-primary" : "bg-card border-border"}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${noon ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              <Sun className="w-7 h-7" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-lg">{t("ci.noon")}</p>
              <p className="text-muted-foreground">{t("ci.noonDesc")}</p>
            </div>
            {noon ? <CheckCircle2 className="w-7 h-7 text-primary" /> : <span className="text-primary font-semibold">+20</span>}
          </button>

          <button
            onClick={async () => { if (!evening) { const ok = await persistCheckin(user?.id, "evening", lang); if (ok) setEvening(true); } }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition ${evening ? "bg-primary/5 border-primary" : "bg-card border-border"}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${evening ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              <Moon className="w-7 h-7" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-lg">{t("ci.eveningT")}</p>
              <p className="text-muted-foreground">{t("ci.eveningDesc")}</p>
            </div>
            {evening ? <CheckCircle2 className="w-7 h-7 text-primary" /> : <span className="text-primary font-semibold">+20</span>}
          </button>
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary border border-border">
          <Bell className="w-5 h-5 text-primary" />
          <p className="flex-1">{t("ci.reminder")}</p>
          <div className="w-12 h-7 rounded-full bg-primary relative">
            <div className="absolute right-0.5 top-0.5 w-6 h-6 bg-white rounded-full" />
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <p className="font-semibold text-muted-foreground mb-3">{t("ci.photoTitle")}</p>
        <div className="rounded-3xl bg-gradient-to-br from-[var(--gold)]/30 via-cream to-secondary border border-border p-5">
          {!photo ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xl">{t("ci.takePhoto")}</p>
                  <p className="text-muted-foreground mt-0.5">{t("ci.photoDesc")}</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full mt-4 py-5 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition"
              >
                <Camera className="w-7 h-7" /> {t("ci.photoBtn")}
              </button>
            </>
          ) : (
            <>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={photo} alt={t("ci.photoAlt")} className="w-full h-56 object-cover" />
                <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("ci.notePh")}
                className="w-full mt-3 bg-card border border-border rounded-2xl p-3 outline-none resize-none"
                rows={2}
              />
              <p className="font-semibold text-muted-foreground mt-3 mb-2">{t("ci.sendTo")}</p>
              <div className="flex flex-wrap gap-2">
                {familyKeys.map((f) => {
                  const on = picked.includes(f.key);
                  const name = t(`ci.fam.${f.key}`);
                  return (
                    <button
                      key={f.key}
                      onClick={() => toggle(f.key)}
                      className={`px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 border transition ${on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}
                    >
                      <span className={`w-7 h-7 rounded-full ${f.color} text-white flex items-center justify-center`}>{name.slice(-1)}</span>
                      {name}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={share}
                disabled={picked.length === 0 || sent}
                className="w-full mt-4 py-5 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition disabled:opacity-60"
              >
                {sent ? (<><Heart className="w-6 h-6 fill-current" /> {t("ci.sent")}</>) : (<><Send className="w-6 h-6" /> {t("ci.sendNow")} ({picked.length})</>)}
              </button>
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}
