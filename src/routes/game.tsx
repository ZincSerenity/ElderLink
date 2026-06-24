import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Users, Trophy, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/game")({ component: GamePage });

function GamePage() {
  const { t } = useLang();
  const games = [
    { key: "mahjong", players: "12k", points: 50, emoji: "🀄" },
    { key: "flip", players: "8k", points: 30, emoji: "🧠" },
    { key: "sudoku", players: "5k", points: 40, emoji: "🔢" },
    { key: "chess", players: "9k", points: 60, emoji: "♟️" },
  ];

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <h1 className="text-3xl font-display">{t("game.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("game.subtitle")}</p>
      </section>

      <section className="px-5 mt-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] text-primary-foreground p-5">
          <div className="flex items-center gap-2"><Trophy className="w-5 h-5" /><p className="font-semibold text-lg">{t("game.weekly")}</p></div>
          <p className="mt-2 opacity-90">{t("game.weeklyDesc")}</p>
          <div className="mt-3 h-2 bg-white/20 rounded-full"><div className="h-full bg-[var(--gold)] rounded-full" style={{ width: "60%" }} /></div>
          <p className="opacity-80 mt-1">{t("game.progress")}</p>
        </div>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {games.map((g) => (
          <div key={g.key} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl active:scale-[0.98] transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-4xl">{g.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg">{t(`game.${g.key}`)}</p>
              <p className="text-muted-foreground">{t(`game.${g.key}Desc`)}</p>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <Users className="w-4 h-4" /> {g.players} {t("game.players")}
              </div>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <Sparkles className="w-4 h-4" /> +{g.points}
            </button>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
