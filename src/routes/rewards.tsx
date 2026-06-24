import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Gift } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

function RewardsPage() {
  const { t } = useLang();
  const rewards = [
    { key: "rice", points: 1500, brand: "wellcome", emoji: "🍚" },
    { key: "eggs", points: 600, brand: "parkn", emoji: "🥚" },
    { key: "oil", points: 800, brand: "wellcome", emoji: "🫒" },
    { key: "tissue", points: 400, brand: "watsons", emoji: "🧻" },
    { key: "tea", points: 2000, brand: "ying", emoji: "🍵" },
    { key: "pharm", points: 1800, brand: "mannings", emoji: "💊" },
  ];

  return (
    <AppShell>
      <section className="px-5 pt-6 flex items-center gap-3">
        <Link to="/" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-display">{t("rw.title")}</h1>
          <p className="text-muted-foreground">{t("rw.subtitle")}</p>
        </div>
      </section>

      <section className="px-5 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-[var(--gold)] to-accent p-5 text-accent-foreground flex items-center justify-between">
          <div>
            <p>{t("rw.points")}</p>
            <p className="text-4xl font-display mt-1">1,280 {t("rw.unit")}</p>
          </div>
          <Gift className="w-12 h-12 opacity-80" />
        </div>
      </section>

      <section className="px-5 mt-6 grid grid-cols-2 gap-3">
        {rewards.map((r) => {
          const can = 1280 >= r.points;
          return (
            <div key={r.key} className="bg-card border border-border rounded-2xl p-4 flex flex-col">
              <div className="w-full aspect-square rounded-xl bg-secondary flex items-center justify-center text-5xl mb-3">{r.emoji}</div>
              <p className="text-muted-foreground">{t(`rw.b.${r.brand}`)}</p>
              <p className="font-semibold mt-0.5 leading-tight">{t(`rw.r.${r.key}`)}</p>
              <button disabled={!can} className={`mt-3 w-full py-2.5 rounded-full font-semibold transition ${can ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {r.points} {t("rw.unit")}
              </button>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
