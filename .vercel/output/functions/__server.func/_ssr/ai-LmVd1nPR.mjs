import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { v as Utensils, D as Dumbbell, w as Trees, x as Droplet, S as Sparkles, r as MicOff, s as Mic, X, j as LoaderCircle, g as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const topicDefs = [{
  key: "food",
  icon: Utensils,
  color: "from-[oklch(0.7_0.18_30)] to-[var(--gold)]"
}, {
  key: "exercise",
  icon: Dumbbell,
  color: "from-[oklch(0.65_0.15_145)] to-[oklch(0.75_0.15_145)]"
}, {
  key: "park",
  icon: Trees,
  color: "from-[oklch(0.6_0.15_180)] to-[oklch(0.7_0.15_180)]"
}, {
  key: "water",
  icon: Droplet,
  color: "from-[oklch(0.65_0.15_240)] to-[oklch(0.75_0.15_240)]"
}];
function AIPage() {
  const {
    t,
    lang
  } = useLang();
  const [input, setInput] = reactExports.useState("");
  const [activeKey, setActiveKey] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [listening, setListening] = reactExports.useState(false);
  const [isResponding, setIsResponding] = reactExports.useState(false);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isResponding]);
  const active = topicDefs.find((d) => d.key === activeKey) ?? null;
  const getSmartFallbackReply = (userText, topic) => {
    const text = userText.toLowerCase();
    if (lang === "zh") {
      if (topic === "food") {
        if (text.includes("湯") || text.includes("老火湯")) return "老火湯雖然好飲，但對長者嚟講嘌呤同鹽分可能偏高。建議煲啲清淡嘅湯，好似節瓜瘦肉湯或者青紅蘿蔔湯，清熱潤肺又健康！今日想試嚇煲邊款？";
        if (text.includes("痛風") || text.includes("糖尿")) return "飲食方面要特別小心。如果有高血糖，記得要少食多餐，多選高纖維嘅嘢食（好似燕麥、糙米）。你想了解邊一類型嘅一日三餐餐單建議？";
        return "均衡飲食對長者最重要！每餐要記得維持「三低一高」（低鹽、低糖、低脂、高纖）。你有冇邊種特別想食嘅食材，等我幫你睇睇適唔適合？";
      }
      if (topic === "exercise") {
        if (text.includes("痛") || text.includes("膝頭")) return "膝頭關節痛嘅話，切記唔好勉強做劇烈運動。可以試嚇坐喺椅上面，慢慢伸直雙腳擡高，鍛鍊大腿肌肉，保護膝關節。要唔要我一步步教你做？";
        if (text.includes("暈") || text.includes("攰")) return "做運動最緊要量力而行，如果覺得頭暈或者太累，要即刻停低休息，飲啖溫水。平時可以試嚇晨早去散散步，或者做嚇簡單拉筋。";
        return "每日做 15 到 20 分鐘輕量運動，好似八段錦、太極或者急步行，對心肺功能同平衡力都有好大幫助。今日你打算做邊款運動？";
      }
      if (topic === "park") {
        if (text.includes("九龍") || text.includes("附近")) return "九龍公園、觀塘海濱花園或者佐敦谷公園都係散步好去處！那裡樹木多、空氣好，而且有無障礙通道，非常適合行嚇坐嚇。你今日想去邊個公園行嚇？";
        if (text.includes("蚊") || text.includes("蟲")) return "去公園散步還散步，記得著長袖衫褲，或者噴定驅蚊水。黃昏時間草叢蚊蟲比較多，要多加留意啊！";
        return "去公園行嚇可以曬嚇太陽，補充維他命 D，對骨骼健康極有幫助。出門記得帶把遮，同埋帶夠溫水飲用！";
      }
      if (topic === "water") {
        if (text.includes("夜尿") || text.includes("夜")) return "驚夜尿多嘅話，可以集中喺日頭飲多點水，食飯前、食完藥都飲兩啖；到咗夜晚 8 點之後就盡量飲少點。咁樣就可以保證水分足夠，又唔會影響睡眠品質啦。";
        if (text.includes("茶") || text.includes("咖啡")) return "茶同咖啡雖然都係液體，但它們有利尿作用，唔能夠完全代替清水。最好還是每隔兩個鐘，就飲半杯暖清水。";
        return "長者嘅口渴感覺通常比較遲鈍，所以唔好等口渴先飲水。建議每日飲 6 至 8 杯暖水，由朝早起身第一杯暖水開始吧！";
      }
      return "多謝你同我分享！活得健康最緊要保持開朗嘅心情。仲有冇其他健康方面嘅問題想同我聊聊？";
    } else {
      if (topic === "food") return "A balanced diet is key for healthy aging! Focus on high-fiber foods, lean proteins, and low-sodium meals. What are you planning to eat today?";
      if (topic === "exercise") return "Light exercises like stretching, Tai Chi, or walking for 20 minutes a day can tremendously improve mobility and balance. Remember to listen to your body!";
      if (topic === "park") return "Visiting parks is wonderful for getting Vitamin D and fresh air. Please wear comfortable shoes and stay on the paved walking paths.";
      if (topic === "water") return "Elders have a weaker thirst reflex, so don't wait until you're thirsty. Try to drink small cups of warm water throughout the day.";
      return "Thank you for sharing! Maintaining a joyful heart is the best medicine. Is there anything else about health you'd like to discuss?";
    }
  };
  const openTopic = (d) => {
    setActiveKey(d.key);
    setMessages([{
      me: false,
      text: lang === "zh" ? `您好！我是您的健康隨身助手。讓我們聊聊關於「${t(`ai.${d.key}`)}」的話題吧！有什麼我可以幫到您？` : `Hello! I am your health companion. Let's talk about ${t(`ai.${d.key}`)}. How can I help you today?`
    }]);
  };
  const send = async (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, {
      me: true,
      text: value
    }]);
    setInput("");
    setIsResponding(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: value,
          topic: activeKey,
          lang
        }
      });
      if (error || !data?.reply) {
        throw new Error("Edge Function unavailable");
      }
      setMessages((m) => [...m, {
        me: false,
        text: data.reply
      }]);
    } catch (err) {
      setTimeout(() => {
        const fallbackReply = getSmartFallbackReply(value, activeKey);
        setMessages((m) => [...m, {
          me: false,
          text: fallbackReply
        }]);
        setIsResponding(false);
      }, 700);
      return;
    }
    setIsResponding(false);
  };
  const handleLiveVoiceSpeech = () => {
    const customWindow = window;
    const SpeechRecognition = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(lang === "zh" ? "您的瀏覽器不支援語音功能" : "Speech recognition not supported.");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === "zh" ? "zh-HK" : "en-US";
    recognition.onstart = () => {
      setListening(true);
      toast(lang === "zh" ? "正在聆聽中...請直接說話" : "Listening... please speak directly");
    };
    recognition.onerror = () => {
      setListening(false);
      toast.error(lang === "zh" ? "未能聽清，請靠近麥克風再試一次" : "Voice recognition failed.");
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      toast.success(lang === "zh" ? `成功識別: "${speechText}"` : `Identified: "${speechText}"`);
      if (activeKey) {
        setInput(speechText);
      } else {
        openTopic(topicDefs[0]);
        send(speechText);
      }
    };
    recognition.start();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.18_280)] to-primary flex items-center justify-center text-white shadow-md shadow-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("ai.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("ai.subtitle") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: topicDefs.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openTopic(d), className: `relative overflow-hidden rounded-3xl p-5 text-left text-white shadow-md active:scale-[0.97] transition bg-gradient-to-br ${d.color}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/15" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(d.icon, { className: "w-9 h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display mt-3", children: t(`ai.${d.key}`) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 text-sm mt-1 truncate", children: lang === "zh" ? "點擊開啟對話" : "Tap to discuss" })
    ] }, d.key)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground mb-3", children: t("ai.askMore") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLiveVoiceSpeech, className: `w-full border rounded-3xl p-5 flex items-center gap-4 transition shadow-sm ${listening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-card border-border text-foreground active:scale-[0.98]"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center shadow-md shrink-0 ${listening ? "bg-white text-red-500" : "bg-gradient-to-br from-primary to-[var(--gold)] text-primary-foreground"}`, children: listening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-8 h-8" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-8 h-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: listening ? lang === "zh" ? "正在聽您說話..." : "Listening..." : t("ai.speakAsk") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: listening ? "text-white/80 text-sm" : "text-muted-foreground text-sm", children: listening ? lang === "zh" ? "請講...完畢後會自動識別" : "Please speak now..." : t("ai.speakHint") })
        ] })
      ] })
    ] }),
    active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-2xl bg-gradient-to-br ${active.color} text-white flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(active.icon, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg leading-tight", children: t(`ai.${active.key}`) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600 font-medium mt-0.5", children: "● AI 陪伴顧問在線" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setActiveKey(null);
          setMessages([]);
        }, className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground transition active:scale-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/10", children: [
        messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.me ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[80%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed ${m.me ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border text-foreground rounded-tl-none"}`, children: m.text }) }, i)),
        isResponding && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none text-muted-foreground flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "zh" ? "AI 正在思考中..." : "AI is thinking..." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-4 flex items-center gap-2 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleLiveVoiceSpeech, className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition ${listening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-secondary border-transparent text-primary hover:bg-muted"}`, children: listening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: listening ? lang === "zh" ? "正在傾聽語音..." : "Listening..." : lang === "zh" ? "請輸入訊息或直接說話..." : "Ask a question...", className: "flex-1 bg-muted/60 border border-border rounded-xl px-4 py-3 text-base outline-none focus:border-primary font-medium" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(), disabled: !input.trim() || isResponding, className: "w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow transition active:scale-95 disabled:opacity-40 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5" }) })
      ] })
    ] })
  ] });
}
export {
  AIPage as component
};
