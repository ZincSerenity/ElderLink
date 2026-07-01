import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Trophy, S as Sparkles, X, b as CircleCheck, j as LoaderCircle } from "../_libs/lucide-react.mjs";
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
async function persistGamePlay(userId, gameKey, points, lang) {
  if (!userId) {
    toast.error(lang === "zh" ? "請先登入" : "Please sign in");
    return false;
  }
  const {
    error
  } = await supabase.from("game_plays").insert({
    user_id: userId,
    game_key: gameKey,
    points_earned: points
  });
  if (error) {
    toast.error(error.message);
    return false;
  }
  toast.success(lang === "zh" ? `恭喜通關！賺取了 +${points} 積分！` : `Congratulations! Earned +${points} points!`);
  return true;
}
const gameThemes = {
  mahjong: ["🀄", "🏮", "🥢", "🐼", "🎋", "🪙"],
  flip: ["💡", "🧠", "🎯", "🔮", "🔑", "🎨"],
  chess: ["👑", "🏰", "🐴", "♟️", "⚔️", "🛡️"]
};
const SUDOKU_PUZZLE = [1, 0, 3, 4, 3, 4, 0, 2, 2, 0, 4, 3, 4, 3, 2, 0];
const SUDOKU_SOLUTION = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
function GamePage() {
  const {
    t,
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const [currentGame, setCurrentGame] = reactExports.useState(null);
  const [cards, setCards] = reactExports.useState([]);
  const [selectedIndices, setSelectedIndices] = reactExports.useState([]);
  const [sudokuBoard, setSudokuBoard] = reactExports.useState([]);
  const [isSavingPoints, setIsSavingPoints] = reactExports.useState(false);
  const games = [{
    key: "mahjong",
    points: 50,
    emoji: "🀄"
  }, {
    key: "flip",
    points: 30,
    emoji: "🧠"
  }, {
    key: "sudoku",
    points: 40,
    emoji: "🔢"
  }, {
    key: "chess",
    points: 60,
    emoji: "♟️"
  }];
  const {
    data: plays,
    refetch
  } = useQuery({
    queryKey: ["game_plays", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("game_plays").select("*").eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const weeklyProgress = reactExports.useMemo(() => {
    if (!plays) return 0;
    const oneWeekAgo = /* @__PURE__ */ new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return plays.filter((p) => new Date(p.created_at) >= oneWeekAgo).length;
  }, [plays]);
  const weeklyGoal = 5;
  const progressPercentage = Math.min(100, weeklyProgress / weeklyGoal * 100);
  const startPlaySession = (game) => {
    if (game.key === "sudoku") {
      setSudokuBoard([...SUDOKU_PUZZLE]);
    } else {
      const themeEmojis = gameThemes[game.key] || gameThemes.flip;
      const gameDeck = [...themeEmojis, ...themeEmojis].map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      })).sort(() => Math.random() - 0.5);
      setCards(gameDeck);
      setSelectedIndices([]);
    }
    setCurrentGame(game);
  };
  const handleCardClick = (clickedIndex) => {
    if (cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched || selectedIndices.length >= 2) return;
    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);
    const nextSelected = [...selectedIndices, clickedIndex];
    setSelectedIndices(nextSelected);
    if (nextSelected.length === 2) {
      const [firstIdx, secondIdx] = nextSelected;
      if (updatedCards[firstIdx].emoji === updatedCards[secondIdx].emoji) {
        updatedCards[firstIdx].isMatched = true;
        updatedCards[secondIdx].isMatched = true;
        setCards(updatedCards);
        setSelectedIndices([]);
      } else {
        setTimeout(() => {
          updatedCards[firstIdx].isFlipped = false;
          updatedCards[secondIdx].isFlipped = false;
          setCards([...updatedCards]);
          setSelectedIndices([]);
        }, 900);
      }
    }
  };
  const handleSudokuCellClick = (index) => {
    if (SUDOKU_PUZZLE[index] !== 0) return;
    const updatedBoard = [...sudokuBoard];
    const currentVal = updatedBoard[index];
    updatedBoard[index] = currentVal === 4 ? 1 : currentVal === 0 ? 1 : currentVal + 1;
    setSudokuBoard(updatedBoard);
  };
  const isGameWon = reactExports.useMemo(() => {
    if (!currentGame) return false;
    if (currentGame.key === "sudoku") {
      return sudokuBoard.length === 16 && sudokuBoard.every((val, idx) => val === SUDOKU_SOLUTION[idx]);
    }
    return cards.length > 0 && cards.every((c) => c.isMatched);
  }, [cards, sudokuBoard, currentGame]);
  const handleClaimPoints = async () => {
    if (!currentGame) return;
    setIsSavingPoints(true);
    const ok = await persistGamePlay(user?.id, currentGame.key, currentGame.points, lang);
    if (ok) {
      queryClient.setQueryData(["game_plays", user?.id], (oldData) => {
        const newRecord = {
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          game_key: currentGame.key,
          points_earned: currentGame.points,
          user_id: user?.id
        };
        return oldData ? [...oldData, newRecord] : [newRecord];
      });
      await refetch();
      setCurrentGame(null);
    }
    setIsSavingPoints(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("game.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: t("game.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.62_0.2_35)] text-primary-foreground p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: t("game.weekly") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 opacity-90", children: t("game.weeklyDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[var(--gold)] rounded-full transition-all duration-500", style: {
        width: `${progressPercentage}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-80 mt-1.5 text-sm", children: lang === "zh" ? `本週已挑戰成功 ${weeklyProgress} / ${weeklyGoal} 次` : `Completed ${weeklyProgress} / ${weeklyGoal} games this week` })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6 space-y-3", children: games.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-card border border-border rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-4xl shadow-inner shrink-0", children: g.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: t(`game.${g.key}`) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-snug", children: t(`game.${g.key}Desc`) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startPlaySession(g), className: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-full font-semibold flex items-center gap-1 shrink-0 transition active:scale-95 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
        "開始 (+",
        g.points,
        ")"
      ] })
    ] }, g.key)) }),
    currentGame && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentGame.emoji }),
            " ",
            t(`game.${currentGame.key}`)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: currentGame.key === "sudoku" ? "💡 提示：點擊空格會切換數字 1 至 4，使每行每列都有 1-4" : "翻開卡牌，找出配對的精美圖案吧！" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCurrentGame(null), className: "w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground transition shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      !isGameWon ? currentGame.key === "sudoku" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 bg-muted p-3 rounded-2xl border-2 border-border shadow-inner my-2", children: sudokuBoard.map((cellValue, idx) => {
        const isGiven = SUDOKU_PUZZLE[idx] !== 0;
        const borderRight = idx % 4 === 1 ? "border-r-4 border-muted" : "";
        const borderBottom = Math.floor(idx / 4) === 1 ? "border-b-4 border-muted" : "";
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSudokuCellClick(idx), className: `h-16 rounded-xl flex items-center justify-center text-2xl font-display transition-all ${borderRight} ${borderBottom} ${isGiven ? "bg-secondary text-muted-foreground font-bold opacity-90 cursor-not-allowed" : cellValue === 0 ? "bg-card border border-dashed border-border text-transparent hover:border-primary active:bg-primary/5" : "bg-card border border-primary text-primary font-bold"}`, children: cellValue === 0 ? "" : cellValue }, idx);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 my-2", children: cards.map((card, index) => {
        const visible = card.isFlipped || card.isMatched;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCardClick(index), className: `h-24 rounded-2xl flex items-center justify-center text-3xl font-bold border transition-all duration-300 transform active:scale-95 ${card.isMatched ? "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-80 scale-95" : card.isFlipped ? "bg-card border-primary" : "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground border-transparent shadow-md"}`, children: visible ? card.emoji : "❓" }, card.id);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 flex flex-col items-center justify-center animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-3xl font-display text-emerald-600", children: "精彩！挑戰成功！" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 max-w-[250px] mx-auto text-sm", children: "您的頭腦太靈活了！立刻領取屬於您的挑戰獎勵積分吧。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: isSavingPoints, onClick: handleClaimPoints, className: "w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50", children: isSavingPoints ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-yellow-300 fill-current" }),
          "領取 +",
          currentGame.points,
          " 積分獎勵"
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  GamePage as component
};
