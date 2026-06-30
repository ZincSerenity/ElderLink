import { Link } from "@tanstack/react-router";
import { Gamepad2, MessageCircle, Sparkles, CheckCircle2, Heart, Languages, LogIn, Radar } from "lucide-react";
import { useLang } from "@/lib/i18n";

const logoIcon = new URL("../assets/icon.png", import.meta.url).href;

export function LandingPage() {
  const { lang, setLang, t } = useLang();

  const introFeatures = [
    {
      icon: CheckCircle2,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title_zh: "每日安心打卡",
      title_en: "Daily Check-in",
      desc_zh: "定時一鍵記錄平安，自動同步通知屋企人，等每個人都放下一顆心。",
      desc_en: "One-tap daily status check-in, keeping your family updated and worry-free."
    },
    {
      icon: Gamepad2,
      tint: "bg-primary/10 text-primary",
      title_zh: "活腦益智遊戲",
      title_en: "Brain Games",
      desc_zh: "專為長者設計的趣味小遊戲，動動手指鍛鍊大腦，玩完仲可以賺積分。",
      desc_en: "Fun, mind-stimulating mini-games designed to exercise brain power while earning points."
    },
    {
      icon: MessageCircle,
      tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      title_zh: "長者無障礙聊天",
      title_en: "Simple Chat",
      desc_zh: "超大字體與簡化介面，讓長者可以毫無壓力地同屋企人發送溫馨訊息。",
      desc_en: "Ultra-large fonts and simplified UI for elders to text family without stress."
    },
    {
      icon: Sparkles,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      title_zh: "AI 智慧生活助手",
      title_en: "AI Smart Assistant",
      desc_zh: "全天候提供健康溫馨提示、關懷聊天與貼心的日常生活小建議。",
      desc_en: "24/7 personalized companion offering lifestyle tips, care, and healthy advice."
    },
    {
      icon: Heart,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      title_zh: "積分換領日用品",
      title_en: "Points Rewards",
      desc_zh: "打卡或者打遊戲賺到嘅積分，可以喺系統免費換領白米、食油等精美日用品。",
      desc_en: "Earn points through basic tasks and redeem daily essentials like rice or cooking oil."
    },
    {
      icon: Radar,
      tint: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      title_zh: "社區鄰近探索",
      title_en: "Nearby Explorer",
      desc_zh: "發掘屋企附近實用的長者中心、醫療機構與社區精彩活動資訊。",
      desc_en: "Discover convenient elder centers, clinics, and active neighborhood events near home."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 overflow-hidden">
              <img src={logoIcon} alt="ElderLink Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none">ElderLink</p>
              <p className="text-muted-foreground mt-1 truncate">{t("app.tagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1.5 bg-secondary text-foreground px-3 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition"
            >
              <Languages className="w-5 h-5" />
              <span className="hidden sm:inline">{t("lang.toggle")}</span>
            </button>
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold shadow-sm active:scale-95 transition"
            >
              <LogIn className="w-5 h-5" />
              <span>{t("landing.signIn")}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8">
        {/* Hero */}
        <section className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mx-auto overflow-hidden">
             <img src={logoIcon} alt="ElderLink Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-display mt-5 leading-tight">
            {t("landing.heroTitle1")} <span className="text-primary">{t("landing.heroTitle2")}</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-sm mx-auto">
            {t("landing.heroDesc")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-md active:scale-95 transition"
            >
              <LogIn className="w-5 h-5" />
              {t("landing.getStarted")}
            </Link>
          </div>
        </section>

        {/* 🌟 核心特色功能展示區塊 */}
        <section className="mt-12 border-t border-border pt-10 pb-12">
          <h2 className="text-2xl font-display text-center mb-1 text-foreground">
            {lang === "zh" ? "核心特色功能" : "Core App Features"}
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            {lang === "zh" ? "專為長者與家人跨代連結打造" : "Tailored specifically for intergenerational companion"}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {introFeatures.map((f, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.tint}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground">
                    {lang === "zh" ? f.title_zh : f.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {lang === "zh" ? f.desc_zh : f.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground border-t border-border pt-6 mt-4">
          <p>&copy; {new Date().getFullYear()} ElderLink. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}