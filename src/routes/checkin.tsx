import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, Bell, Flame, Sun, Moon, Camera, Send, X, Heart, Loader2 } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkin")({ component: CheckinPage });

async function persistCheckin(userId: string | undefined, kind: string, lang: "zh" | "en") {
  if (!userId) {
    toast.error(lang === "zh" ? "請先登入" : "Please sign in");
    return false;
  }
  const { error } = await supabase.from("checkins").insert({ user_id: userId, kind });
  if (error) { toast.error(error.message); return false; }
  toast.success(lang === "zh" ? "已打卡！" : "Checked in!");
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
  const queryClient = useQueryClient();
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string[]>(["son", "daughter", "grand"]);
  const [sent, setSent] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: checkins, refetch } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("checkins").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const now = new Date();
  const currentHour = now.getHours();
  const today = now.toDateString();

  const isNoonWindow = currentHour >= 11 && currentHour < 14; 
  const isEveningWindow = currentHour >= 18; 

  const noonChecked = useMemo(() => 
    checkins?.some(c => new Date(c.created_at).toDateString() === today && c.kind === "noon"), 
    [checkins, today]
  );
  
  const eveningChecked = useMemo(() => 
    checkins?.some(c => new Date(c.created_at).toDateString() === today && c.kind === "evening"), 
    [checkins, today]
  );

  const streakCount = useMemo(() => {
    if (!checkins) return 0;
    const uniqueDays = new Set(checkins.map(c => new Date(c.created_at).toDateString()));
    return uniqueDays.size;
  }, [checkins]);

  const weekData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const isChecked = checkins?.some(c => new Date(c.created_at).toDateString() === d.toDateString());
      return { date: d, checked: isChecked };
    });
  }, [checkins]);

  const handleCheckin = async (kind: string) => {
    setIsSubmitting(true);
    const ok = await persistCheckin(user?.id, kind, lang);
    if (ok) {
      queryClient.setQueryData(["checkins", user?.id], (oldData: any) => {
        const newRecord = { created_at: new Date().toISOString(), kind, user_id: user?.id };
        return oldData ? [...oldData, newRecord] : [newRecord];
      });
      await refetch();
    }
    setIsSubmitting(false);
  };

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
      </section>

      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-orange-500 text-primary-foreground p-6 text-center">
          <Flame className="w-10 h-10 mx-auto text-yellow-300" />
          <p className="text-5xl font-display mt-2">{streakCount} <span className="text-2xl">日</span></p>
          <p className="opacity-90 mt-1">連續打卡紀錄</p>
          <div className="flex justify-between mt-5">
            {weekData.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${w.checked ? "bg-yellow-300 text-black" : "bg-white/20"}`}>
                  {w.checked ? "✓" : w.date.toLocaleDateString('zh-HK', { weekday: 'narrow' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="space-y-3">
          <button
            disabled={noonChecked || !isNoonWindow || isSubmitting}
            onClick={() => handleCheckin("noon")}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition ${noonChecked ? "bg-red-50 border-red-500 opacity-100 cursor-not-allowed" : !isNoonWindow ? "bg-gray-100 opacity-50 cursor-not-allowed border-transparent" : "bg-card border-border"}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${noonChecked ? "bg-red-500 text-white" : "bg-secondary"}`}>
              {isSubmitting ? <Loader2 className="animate-spin w-7 h-7" /> : <Sun className="w-7 h-7" />}
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-lg">中午 12 點</p>
              <p className={`text-sm ${noonChecked ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                {noonChecked ? "今日已打卡" : isNoonWindow ? "食晏前打個卡" : "尚未到打卡時間"}
              </p>
            </div>
            {noonChecked && <CheckCircle2 className="w-7 h-7 text-red-500" />}
          </button>

          <button
            disabled={eveningChecked || !isEveningWindow || isSubmitting}
            onClick={() => handleCheckin("evening")}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition ${eveningChecked ? "bg-red-50 border-red-500 opacity-100 cursor-not-allowed" : !isEveningWindow ? "bg-gray-100 opacity-50 cursor-not-allowed border-transparent" : "bg-card border-border"}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${eveningChecked ? "bg-red-500 text-white" : "bg-secondary"}`}>
              {isSubmitting ? <Loader2 className="animate-spin w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-lg">夜晚 6 點</p>
              <p className={`text-sm ${eveningChecked ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                {eveningChecked ? "今日已打卡" : isEveningWindow ? "食晚飯前打個卡" : "尚未到打卡時間"}
              </p>
            </div>
            {eveningChecked && <CheckCircle2 className="w-7 h-7 text-red-500" />}
          </button>
        </div>
      </section>

      <section className="px-5 mt-6">
        <button 
          onClick={() => setRemindersEnabled(!remindersEnabled)}
          className={`flex items-center gap-3 p-4 rounded-2xl w-full border ${remindersEnabled ? "bg-primary/5 border-primary" : "bg-secondary border-border"}`}
        >
          <Bell className="w-5 h-5 text-primary" />
          <p className="flex-1 text-left">{t("ci.reminder")}</p>
          <div className={`w-12 h-7 rounded-full relative transition ${remindersEnabled ? "bg-primary" : "bg-gray-400"}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${remindersEnabled ? "left-5.5" : "left-0.5"}`} />
          </div>
        </button>
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