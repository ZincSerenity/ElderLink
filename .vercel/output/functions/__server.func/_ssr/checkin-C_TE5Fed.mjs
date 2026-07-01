import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as Flame, j as LoaderCircle, m as Sun, b as CircleCheck, n as Moon, B as Bell, o as Camera, X, p as Heart, g as Send } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function persistCheckin(userId, kind, lang) {
  if (!userId) {
    toast.error(lang === "zh" ? "請先登入" : "Please sign in");
    return false;
  }
  const {
    error
  } = await supabase.from("checkins").insert({
    user_id: userId,
    kind
  });
  if (error) {
    toast.error(error.message);
    return false;
  }
  toast.success(lang === "zh" ? "已打卡！" : "Checked in!");
  return true;
}
const familyKeys = [{
  key: "son",
  color: "bg-accent"
}, {
  key: "daughter",
  color: "bg-[var(--gold)]"
}, {
  key: "grand",
  color: "bg-[oklch(0.7_0.18_320)]"
}, {
  key: "dil",
  color: "bg-[oklch(0.65_0.15_145)]"
}];
function CheckinPage() {
  const {
    t,
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const [photo, setPhoto] = reactExports.useState(null);
  const [note, setNote] = reactExports.useState("");
  const [picked, setPicked] = reactExports.useState(["son", "daughter", "grand"]);
  const [sent, setSent] = reactExports.useState(false);
  const [remindersEnabled, setRemindersEnabled] = reactExports.useState(true);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const {
    data: checkins,
    refetch
  } = useQuery({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("checkins").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const now = /* @__PURE__ */ new Date();
  const currentHour = now.getHours();
  const today = now.toDateString();
  const isNoonWindow = currentHour >= 11 && currentHour < 14;
  const isEveningWindow = currentHour >= 18;
  const noonChecked = reactExports.useMemo(() => checkins?.some((c) => new Date(c.created_at).toDateString() === today && c.kind === "noon"), [checkins, today]);
  const eveningChecked = reactExports.useMemo(() => checkins?.some((c) => new Date(c.created_at).toDateString() === today && c.kind === "evening"), [checkins, today]);
  const streakCount = reactExports.useMemo(() => {
    if (!checkins) return 0;
    const uniqueDays = new Set(checkins.map((c) => new Date(c.created_at).toDateString()));
    return uniqueDays.size;
  }, [checkins]);
  const weekData = reactExports.useMemo(() => {
    return Array.from({
      length: 7
    }).map((_, i) => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - (6 - i));
      const isChecked = checkins?.some((c) => new Date(c.created_at).toDateString() === d.toDateString());
      return {
        date: d,
        checked: isChecked
      };
    });
  }, [checkins]);
  const handleCheckin = async (kind) => {
    setIsSubmitting(true);
    const ok = await persistCheckin(user?.id, kind, lang);
    if (ok) {
      queryClient.setQueryData(["checkins", user?.id], (oldData) => {
        const newRecord = {
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          kind,
          user_id: user?.id
        };
        return oldData ? [...oldData, newRecord] : [newRecord];
      });
      await refetch();
    }
    setIsSubmitting(false);
  };
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };
  const toggle = (k) => setPicked((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);
  const share = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPhoto(null);
      setNote("");
    }, 1800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("ci.title") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-to-br from-primary to-orange-500 text-primary-foreground p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-10 h-10 mx-auto text-yellow-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-5xl font-display mt-2", children: [
        streakCount,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "日" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 mt-1", children: "連續打卡紀錄" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-5", children: weekData.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center font-semibold ${w.checked ? "bg-yellow-300 text-black" : "bg-white/20"}`, children: w.checked ? "✓" : w.date.toLocaleDateString("zh-HK", {
        weekday: "narrow"
      }) }) }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: noonChecked || !isNoonWindow || isSubmitting, onClick: () => handleCheckin("noon"), className: `w-full flex items-center gap-3 p-4 rounded-2xl border transition ${noonChecked ? "bg-red-50 border-red-500 opacity-100 cursor-not-allowed" : !isNoonWindow ? "bg-gray-100 opacity-50 cursor-not-allowed border-transparent" : "bg-card border-border"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center ${noonChecked ? "bg-red-500 text-white" : "bg-secondary"}`, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin w-7 h-7" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-7 h-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: "中午 12 點" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${noonChecked ? "text-red-600 font-bold" : "text-muted-foreground"}`, children: noonChecked ? "今日已打卡" : isNoonWindow ? "食晏前打個卡" : "尚未到打卡時間" })
        ] }),
        noonChecked && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-7 h-7 text-red-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: eveningChecked || !isEveningWindow || isSubmitting, onClick: () => handleCheckin("evening"), className: `w-full flex items-center gap-3 p-4 rounded-2xl border transition ${eveningChecked ? "bg-red-50 border-red-500 opacity-100 cursor-not-allowed" : !isEveningWindow ? "bg-gray-100 opacity-50 cursor-not-allowed border-transparent" : "bg-card border-border"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center ${eveningChecked ? "bg-red-500 text-white" : "bg-secondary"}`, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin w-7 h-7" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-7 h-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: "夜晚 6 點" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${eveningChecked ? "text-red-600 font-bold" : "text-muted-foreground"}`, children: eveningChecked ? "今日已打卡" : isEveningWindow ? "食晚飯前打個卡" : "尚未到打卡時間" })
        ] }),
        eveningChecked && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-7 h-7 text-red-500" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRemindersEnabled(!remindersEnabled), className: `flex items-center gap-3 p-4 rounded-2xl w-full border ${remindersEnabled ? "bg-primary/5 border-primary" : "bg-secondary border-border"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-left", children: t("ci.reminder") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-7 rounded-full relative transition ${remindersEnabled ? "bg-primary" : "bg-gray-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${remindersEnabled ? "left-5.5" : "left-0.5"}` }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground mb-3", children: t("ci.photoTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-gradient-to-br from-[var(--gold)]/30 via-cream to-secondary border border-border p-5", children: !photo ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: t("ci.takePhoto") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: t("ci.photoDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", hidden: true, onChange: onPick }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileRef.current?.click(), className: "w-full mt-4 py-5 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-7 h-7" }),
          " ",
          t("ci.photoBtn")
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo, alt: t("ci.photoAlt"), className: "w-full h-56 object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPhoto(null), className: "absolute top-2 right-2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value), placeholder: t("ci.notePh"), className: "w-full mt-3 bg-card border border-border rounded-2xl p-3 outline-none resize-none", rows: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground mt-3 mb-2", children: t("ci.sendTo") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: familyKeys.map((f) => {
          const on = picked.includes(f.key);
          const name = t(`ci.fam.${f.key}`);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggle(f.key), className: `px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 border transition ${on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-7 h-7 rounded-full ${f.color} text-white flex items-center justify-center`, children: name.slice(-1) }),
            name
          ] }, f.key);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: share, disabled: picked.length === 0 || sent, className: "w-full mt-4 py-5 rounded-2xl bg-primary text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition disabled:opacity-60", children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-6 h-6 fill-current" }),
          " ",
          t("ci.sent")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-6 h-6" }),
          " ",
          t("ci.sendNow"),
          " (",
          picked.length,
          ")"
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  CheckinPage as component
};
