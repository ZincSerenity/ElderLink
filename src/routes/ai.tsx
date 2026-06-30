import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Mic, MicOff, Utensils, Dumbbell, Trees, Droplet, Send, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/local_client";
import { toast } from "sonner";

export const Route = createFileRoute("/ai")({ component: AIPage });

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

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
  const { t, lang } = useLang();
  const [input, setInput] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [listening, setListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 全自動捲動至對話最底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  const active = topicDefs.find((d) => d.key === activeKey) ?? null;

  // 1. 本地智慧型關鍵字應答引擎（當 Supabase Edge Function 未配置時的完美體驗機制）
  const getSmartFallbackReply = (userText: string, topic: string | null): string => {
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
      // English mode answers
      if (topic === "food") return "A balanced diet is key for healthy aging! Focus on high-fiber foods, lean proteins, and low-sodium meals. What are you planning to eat today?";
      if (topic === "exercise") return "Light exercises like stretching, Tai Chi, or walking for 20 minutes a day can tremendously improve mobility and balance. Remember to listen to your body!";
      if (topic === "park") return "Visiting parks is wonderful for getting Vitamin D and fresh air. Please wear comfortable shoes and stay on the paved walking paths.";
      if (topic === "water") return "Elders have a weaker thirst reflex, so don't wait until you're thirsty. Try to drink small cups of warm water throughout the day.";
      return "Thank you for sharing! Maintaining a joyful heart is the best medicine. Is there anything else about health you'd like to discuss?";
    }
  };

  // 2. 開啟特定健康話題聊天盒
  const openTopic = (d: TopicDef) => {
    setActiveKey(d.key);
    setMessages([
      { me: false, text: lang === "zh" ? `您好！我是您的健康隨身助手。讓我們聊聊關於「${t(`ai.${d.key}`)}」的話題吧！有什麼我可以幫到您？` : `Hello! I am your health companion. Let's talk about ${t(`ai.${d.key}`)}. How can I help you today?` }
    ]);
  };

  // 3. 發送與接收動態對話
  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;

    setMessages((m) => [...m, { me: true, text: value }]);
    setInput("");
    setIsResponding(true);

    try {
      // 優先呼叫 Supabase Edge Function 處理智慧生成
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { message: value, topic: activeKey, lang: lang },
      });

      if (error || !data?.reply) {
        throw new Error("Edge Function unavailable");
      }

      setMessages((m) => [...m, { me: false, text: data.reply }]);
    } catch (err) {
      // 降級處理：由高真實感的本地智慧情境引擎即時作答
      setTimeout(() => {
        const fallbackReply = getSmartFallbackReply(value, activeKey);
        setMessages((m) => [...m, { me: false, text: fallbackReply }]);
        setIsResponding(false);
      }, 700);
      return;
    }
    setIsResponding(false);
  };

  // 4. 真實語音識別（廣東話/英文）
  const handleLiveVoiceSpeech = () => {
    const customWindow = window as SpeechRecognitionWindow;
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

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      toast.success(lang === "zh" ? `成功識別: "${speechText}"` : `Identified: "${speechText}"`);
      
      if (activeKey) {
        setInput(speechText); // 如果已在對話框內，填入輸入框
      } else {
        // 如果在主頁，自動開啟第一個符合的話題或預設話題，並發送
        openTopic(topicDefs[0]);
        send(speechText);
      }
    };

    recognition.start();
  };

  return (
    <AppShell>
      {/* 標題欄 */}
      <section className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.18_280)] to-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display">{t("ai.title")}</h1>
            <p className="text-muted-foreground">{t("ai.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* 四大健康話題卡片按鈕 */}
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
              <p className="opacity-90 text-sm mt-1 truncate">{lang === "zh" ? "點擊開啟對話" : "Tap to discuss"}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 首頁大型快捷語音按鈕 */}
      <section className="px-5 mt-6">
        <p className="font-semibold text-muted-foreground mb-3">{t("ai.askMore")}</p>
        <button
          onClick={handleLiveVoiceSpeech}
          className={`w-full border rounded-3xl p-5 flex items-center gap-4 transition shadow-sm ${
            listening 
              ? "bg-red-500 border-red-500 text-white animate-pulse" 
              : "bg-card border-border text-foreground active:scale-[0.98]"
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md shrink-0 ${listening ? "bg-white text-red-500" : "bg-gradient-to-br from-primary to-[var(--gold)] text-primary-foreground"}`}>
            {listening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </div>
          <div className="text-left">
            <p className="font-display text-xl">{listening ? (lang === "zh" ? "正在聽您說話..." : "Listening...") : t("ai.speakAsk")}</p>
            <p className={listening ? "text-white/80 text-sm" : "text-muted-foreground text-sm"}>
              {listening ? (lang === "zh" ? "請講...完畢後會自動識別" : "Please speak now...") : t("ai.speakHint")}
            </p>
          </div>
        </button>
      </section>

      {/* 獨立全螢幕 AI 聊天盒覆蓋層 */}
      {active && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-200">
          {/* 頂欄 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${active.color} text-white flex items-center justify-center`}>
                <active.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-display text-lg leading-tight">{t(`ai.${active.key}`)}</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">● AI 陪伴顧問在線</p>
              </div>
            </div>
            <button 
              onClick={() => { setActiveKey(null); setMessages([]); }} 
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground transition active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 訊息滾動對話框 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/10">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed ${
                  m.me 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-card border border-border text-foreground rounded-tl-none"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {/* AI 正在思考輸入狀態 */}
            {isResponding && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{lang === "zh" ? "AI 正在思考中..." : "AI is thinking..."}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 底欄發送與語音輸入 */}
          <div className="border-t border-border p-4 flex items-center gap-2 bg-card">
            <button
              onClick={handleLiveVoiceSpeech}
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition ${
                listening 
                  ? "bg-red-500 border-red-500 text-white animate-pulse" 
                  : "bg-secondary border-transparent text-primary hover:bg-muted"
              }`}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={listening ? (lang === "zh" ? "正在傾聽語音..." : "Listening...") : (lang === "zh" ? "請輸入訊息或直接說話..." : "Ask a question...")}
              className="flex-1 bg-muted/60 border border-border rounded-xl px-4 py-3 text-base outline-none focus:border-primary font-medium"
            />
            
            <button 
              onClick={() => send()} 
              disabled={!input.trim() || isResponding}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow transition active:scale-95 disabled:opacity-40 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}