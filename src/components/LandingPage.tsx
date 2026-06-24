import { Link } from "@tanstack/react-router";
import { Gamepad2, MessageCircle, Sparkles, CheckCircle2, Heart, Languages, LogIn, Radar } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function LandingPage() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display text-2xl shadow-md shrink-0">
              EL
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none">ElderLink</p>
              <p className="text-muted-foreground mt-1 truncate">{t("app.tagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              aria-label="Toggle language"
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
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] flex items-center justify-center text-primary-foreground font-display text-4xl shadow-lg mx-auto">
            EL
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
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-sm active:scale-95 transition"
            >
              {t("landing.createAccount")}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mt-10">
          <h2 className="text-2xl font-display text-center mb-5">{t("landing.why")}</h2>
          <div className="grid grid-cols-1 gap-4">
            <FeatureCard
              icon={Gamepad2}
              title={t("landing.f.game.title")}
              desc={t("landing.f.game.desc")}
              tint="from-primary to-[oklch(0.62_0.2_35)]"
            />
            <FeatureCard
              icon={MessageCircle}
              title={t("landing.f.chat.title")}
              desc={t("landing.f.chat.desc")}
              tint="from-[oklch(0.6_0.15_55)] to-accent"
            />
            <FeatureCard
              icon={Sparkles}
              title={t("landing.f.ai.title")}
              desc={t("landing.f.ai.desc")}
              tint="from-[oklch(0.55_0.16_145)] to-[oklch(0.72_0.14_140)]"
            />
            <FeatureCard
              icon={CheckCircle2}
              title={t("landing.f.checkin.title")}
              desc={t("landing.f.checkin.desc")}
              tint="from-[oklch(0.55_0.18_295)] to-[oklch(0.7_0.15_310)]"
            />
            <FeatureCard
              icon={Radar}
              title={t("landing.f.nearby.title")}
              desc={t("landing.f.nearby.desc")}
              tint="from-[oklch(0.55_0.16_145)] via-primary to-[var(--gold)]"
            />
          </div>
        </section>

        {/* Family */}
        <section className="mt-10 rounded-3xl bg-gradient-to-br from-cream to-secondary p-6 border border-border text-center">
          <Heart className="w-8 h-8 text-primary mx-auto fill-primary" />
          <h2 className="text-xl font-display mt-3">{t("landing.familyTitle")}</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">{t("landing.familyDesc")}</p>
        </section>

        {/* Footer CTA */}
        <section className="mt-10 text-center pb-8">
          <p className="text-muted-foreground">{t("landing.footer")}</p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center justify-center gap-2 mt-4 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-md active:scale-95 transition"
          >
            <LogIn className="w-5 h-5" />
            {t("landing.joinNow")}
          </Link>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  tint,
}: {
  icon: typeof Gamepad2;
  title: string;
  desc: string;
  tint: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-4 transition-all active:scale-[0.98]">
      <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${tint} flex items-center justify-center text-white shadow-sm`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="font-semibold text-lg">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-sm">{desc}</p>
      </div>
    </div>
  );
}
