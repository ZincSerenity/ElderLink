import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "zh" | "en";

type Dict = Record<string, { zh: string; en: string }>;

const dict: Dict = {
  // AppShell
  "app.tagline": { zh: "陪你每一天", en: "By your side every day" },
  "nav.home": { zh: "首頁", en: "Home" },
  "nav.game": { zh: "遊戲", en: "Games" },
  "nav.chat": { zh: "傾偈", en: "Chat" },
  "nav.ai": { zh: "幫手", en: "AI Help" },
  "nav.checkin": { zh: "打卡", en: "Check-in" },
  "lang.toggle": { zh: "EN", en: "中" },

  // Home
  "home.greet.morning": { zh: "早安", en: "Good morning" },
  "home.greet.afternoon": { zh: "午安", en: "Good afternoon" },
  "home.greet.evening": { zh: "晚安", en: "Good evening" },
  "home.user": { zh: "王伯伯", en: "Uncle Wong" },
  "home.title1": { zh: "今日", en: "Today" },
  "home.title2": { zh: "開心啲", en: "be happier" },
  "home.points": { zh: "你嘅積分", en: "Your points" },
  "home.pointsUnit": { zh: "分", en: "pts" },
  "home.needMore": { zh: "仲爭 220 分就可以換「米一袋」", en: "220 more points to redeem a bag of rice" },
  "home.redeem": { zh: "去換禮物", en: "Redeem rewards" },
  "home.nextCheckin": { zh: "下次打卡：", en: "Next check-in: " },
  "home.evening6": { zh: "夜晚 6 點", en: "6 PM" },
  "home.nearby.label": { zh: "你附近", en: "Nearby" },
  "home.nearby.title": { zh: "睇下邊個喺附近", en: "See who is nearby" },
  "home.nearby.desc": { zh: "禁一禁，搵附近長者傾偈", en: "Tap to find seniors near you to chat" },
  "home.translate.title": { zh: "翻譯", en: "Translate" },
  "home.translate.desc": { zh: "中文 ↔ English，按一下就得", en: "Chinese ↔ English, one tap" },
  "home.whatToDo": { zh: "想做啲咩？", en: "What would you like to do?" },
  "home.f.game.title": { zh: "玩遊戲", en: "Play games" },
  "home.f.game.desc": { zh: "玩下小遊戲", en: "Fun mini games" },
  "home.f.chat.title": { zh: "傾偈", en: "Chat" },
  "home.f.chat.desc": { zh: "同朋友講嘢", en: "Talk with friends" },
  "home.f.ai.title": { zh: "AI 幫手", en: "AI helper" },
  "home.f.ai.desc": { zh: "想問就問", en: "Ask anything" },
  "home.f.checkin.title": { zh: "打卡", en: "Check-in" },
  "home.f.checkin.desc": { zh: "影張相", en: "Take a photo" },
  "home.family": { zh: "家人", en: "Family" },
  "home.familyDesc": { zh: "分享好心情俾屋企人", en: "Share your day with family" },
  "home.share": { zh: "分享", en: "Share" },
  "home.familyView.title": { zh: "屋企人版", en: "Family view" },
  "home.familyView.desc": { zh: "睇打卡同訊息", en: "Check-ins & messages" },
  "home.son": { zh: "兒", en: "Son" },
  "home.daughter": { zh: "女", en: "Dtr" },
  "home.grandchild": { zh: "孫", en: "Gc" },

  // Landing
  "landing.signIn": { zh: "登入", en: "Sign in" },
  "landing.heroTitle1": { zh: "ElderLink", en: "ElderLink" },
  "landing.heroTitle2": { zh: "陪你每一天", en: "by your side" },
  "landing.heroDesc": { zh: "一個專為長者而設嘅應用，玩遊戲、傾偈、AI 幫手、每日打卡，仲可以同屋企人連結。", en: "An app built for seniors — games, chat, AI helper, daily check-ins, and family connections." },
  "landing.getStarted": { zh: "立即開始", en: "Get started" },
  "landing.createAccount": { zh: "開新戶口", en: "Create account" },
  "landing.why": { zh: "有啲咩功能？", en: "What can you do?" },
  "landing.f.game.title": { zh: "玩遊戲", en: "Play games" },
  "landing.f.game.desc": { zh: "麻雀、翻牌、數獨，邊玩邊賺積分。", en: "Mahjong, memory, sudoku — play and earn points." },
  "landing.f.chat.title": { zh: "同朋友傾偈", en: "Chat with friends" },
  "landing.f.chat.desc": { zh: "搵附近長者一齊傾，識新朋友。", en: "Find seniors nearby and make new friends." },
  "landing.f.ai.title": { zh: "AI 小幫手", en: "AI helper" },
  "landing.f.ai.desc": { zh: "問食咩、做咩運動、附近公園，一問就有答案。", en: "Ask what to eat, exercises, nearby parks — instant answers." },
  "landing.f.checkin.title": { zh: "每日打卡", en: "Daily check-in" },
  "landing.f.checkin.desc": { zh: "中午同夜晚打個卡，影相傳俾屋企人。", en: "Check in at noon and evening, share photos with family." },
  "landing.f.nearby.title": { zh: "搵附近朋友", en: "Find friends nearby" },
  "landing.f.nearby.desc": { zh: "睇下邊個喺你附近，一齊行公園。", en: "See who is near you for a walk in the park." },
  "landing.familyTitle": { zh: "同屋企人連結", en: "Connect with family" },
  "landing.familyDesc": { zh: "屋企人可以睇你打卡記錄、傳訊息、收到未打卡提醒。", en: "Family can see your check-ins, send messages, and get missed check-in alerts." },
  "landing.footer": { zh: "準備好未？加入 ElderLink，開心啲過每一日。", en: "Ready? Join ElderLink and enjoy every day." },
  "landing.joinNow": { zh: "立即加入", en: "Join now" },

  // Game
  "game.title": { zh: "玩遊戲", en: "Play games" },
  "game.subtitle": { zh: "玩下、賺積分、識朋友", en: "Play, earn points, make friends" },
  "game.weekly": { zh: "本週任務", en: "Weekly quest" },
  "game.weeklyDesc": { zh: "玩 5 局，賺 200 分", en: "Play 5 rounds, earn 200 pts" },
  "game.progress": { zh: "已玩 3 / 5 局", en: "3 / 5 rounds played" },
  "game.players": { zh: "人玩緊", en: "playing" },
  "game.mahjong": { zh: "麻雀", en: "Mahjong" },
  "game.mahjongDesc": { zh: "四人麻雀", en: "Four-player Mahjong" },
  "game.flip": { zh: "翻牌", en: "Memory flip" },
  "game.flipDesc": { zh: "練下記性", en: "Train your memory" },
  "game.sudoku": { zh: "數獨", en: "Sudoku" },
  "game.sudokuDesc": { zh: "動下腦", en: "Brain teaser" },
  "game.chess": { zh: "象棋", en: "Chinese chess" },
  "game.chessDesc": { zh: "同朋友對戰", en: "Play with friends" },

  // Chat
  "chat.title": { zh: "傾偈", en: "Chat" },
  "chat.subtitle": { zh: "同朋友家人講嘢", en: "Talk with friends and family" },
  "chat.tap": { zh: "一禁就有人傾", en: "Tap and someone is ready" },
  "chat.meetNew": { zh: "識新朋友", en: "Meet new friends" },
  "chat.meetDesc": { zh: "禁一禁，幫你搵位長者一齊傾。", en: "Tap to be matched with a senior." },
  "chat.tab.family": { zh: "家人", en: "Family" },
  "chat.tab.friend": { zh: "朋友", en: "Friends" },
  "chat.tab.groups": { zh: "群組", en: "Groups" },
  "chat.search": { zh: "搵朋友", en: "Find a friend" },
  "chat.voiceTip": { zh: "講一句就搵到朋友", en: "Say a name to find them" },
  "chat.noResult": { zh: "搵唔到相關嘅聯絡人", en: "No contacts found" },
  "chat.listening": { zh: "聽緊你講…", en: "Listening…" },
  "chat.exampleVoice": { zh: "例如：搵小晴", en: "e.g. find Sunny" },
  "chat.cancel": { zh: "取消", en: "Cancel" },
  "chat.finding": { zh: "幫你搵緊朋友…", en: "Finding a friend…" },
  "chat.findingLong": { zh: "幫你搵緊一位朋友…", en: "Looking for a friend for you…" },
  "chat.fewSec": { zh: "等幾秒就得", en: "Just a few seconds" },
  "chat.typeMsg": { zh: "講句嘢…", en: "Say something…" },
  "chat.again": { zh: "換過一位", en: "Try another" },
  "chat.years": { zh: "歲", en: "yrs" },
  "chat.likes": { zh: "鍾意", en: "Likes" },
  "chat.greeting": { zh: "你好呀！我係", en: "Hi! I'm " },
  "chat.greetingTail": { zh: "，好開心識到你 😊", en: ", nice to meet you 😊" },
  "chat.autoReply": { zh: "係呀，我都鍾意㗎！你平時得閒做啲咩？", en: "Yeah, me too! What do you usually do in your free time?" },

  // AI
  "ai.title": { zh: "AI 幫手", en: "AI Helper" },
  "ai.subtitle": { zh: "禁一禁，或者講一句", en: "Tap or say a word" },
  "ai.askMore": { zh: "想問其他？", en: "Want to ask more?" },
  "ai.speakAsk": { zh: "講出嚟問", en: "Ask by voice" },
  "ai.speakHint": { zh: "禁住個咪，講你想問乜", en: "Hold the mic, say your question" },
  "ai.helper": { zh: "AI 小幫手", en: "AI Helper" },
  "ai.listening": { zh: "聽緊你講…", en: "Listening…" },
  "ai.askAgain": { zh: "再問多句…", en: "Ask another…" },
  "ai.thinking": { zh: "好，等我諗下，再俾啲建議你～", en: "Sure, let me think and give you some suggestions~" },
  "ai.food": { zh: "食", en: "Food" },
  "ai.foodPrompt": { zh: "今日食啲咩好？", en: "What should I eat today?" },
  "ai.foodReply": { zh: "今日天氣涼，建議飲碗淮山杞子雞湯，配菜可以揀蒸魚同灼菜，營養均衡又易消化。", en: "It's cool today — try yam and goji chicken soup, with steamed fish and blanched greens. Balanced and easy to digest." },
  "ai.exercise": { zh: "運動", en: "Exercise" },
  "ai.exercisePrompt": { zh: "今日適合做咩運動？", en: "What exercise is good today?" },
  "ai.exerciseReply": { zh: "可以喺屋企做 15 分鐘伸展操，或者落樓行 30 分鐘。記住熱身先，唔好太劇烈。", en: "Try 15 minutes of stretching at home, or a 30-minute walk. Warm up first, take it easy." },
  "ai.park": { zh: "公園", en: "Park" },
  "ai.parkPrompt": { zh: "附近邊個公園好行？", en: "Which park nearby is nice?" },
  "ai.parkReply": { zh: "維多利亞公園步行 8 分鐘到，有平路同涼亭。今日有書法班，下午 3 點開始。", en: "Victoria Park is 8 minutes' walk, with flat paths and pavilions. There's a calligraphy class at 3 PM today." },
  "ai.water": { zh: "飲水", en: "Water" },
  "ai.waterPrompt": { zh: "我今日要飲幾多水？", en: "How much water should I drink today?" },
  "ai.waterReply": { zh: "長者每日建議飲 6–8 杯水，可以分開早午晚慢慢飲。天氣乾燥要多飲少少。", en: "Seniors should drink 6–8 cups daily, spread over the day. Drink a bit more when it's dry." },
  "ai.voiceSample": { zh: "我今晚煮咩好？", en: "What should I cook tonight?" },

  // Check-in
  "ci.title": { zh: "打卡", en: "Check-in" },
  "ci.subtitle": { zh: "中午同夜晚打卡，賺積分", en: "Check in at noon and evening to earn points" },
  "ci.streakUnit": { zh: "日", en: "days" },
  "ci.streakMsg": { zh: "連續打咗 7 日，叻！", en: "7-day streak — great job!" },
  "ci.today": { zh: "今日打卡", en: "Today's check-in" },
  "ci.noon": { zh: "中午 12 點", en: "12 PM" },
  "ci.noonDesc": { zh: "食晏前打個卡", en: "Check in before lunch" },
  "ci.eveningT": { zh: "夜晚 6 點", en: "6 PM" },
  "ci.eveningDesc": { zh: "食晚飯前打個卡", en: "Check in before dinner" },
  "ci.reminder": { zh: "每日 12 點同 6 點會提你", en: "Reminders at 12 PM and 6 PM daily" },
  "ci.photoTitle": { zh: "影相 · 傳俾屋企人", en: "Photo · share with family" },
  "ci.takePhoto": { zh: "影張相", en: "Take a photo" },
  "ci.photoDesc": { zh: "食緊嘢、行緊街、見到靚景，一禁就傳俾屋企人", en: "Eating, walking, nice views — share with family in one tap" },
  "ci.photoBtn": { zh: "影相", en: "Take photo" },
  "ci.notePh": { zh: "講句嘢俾屋企人（例如：今日去咗公園～）", en: "Add a message for family (e.g. went to the park today~)" },
  "ci.sendTo": { zh: "傳俾邊個？", en: "Send to whom?" },
  "ci.sent": { zh: "已傳俾屋企人！", en: "Sent to family!" },
  "ci.sendNow": { zh: "即刻傳", en: "Send now" },
  "ci.fam.son": { zh: "兒子 阿明", en: "Son · Ming" },
  "ci.fam.daughter": { zh: "女兒 阿玲", en: "Daughter · Ling" },
  "ci.fam.grand": { zh: "孫女 小晴", en: "Granddaughter · Sunny" },
  "ci.fam.dil": { zh: "新抱 美儀", en: "Daughter-in-law · May" },
  "ci.photoAlt": { zh: "打卡相", en: "Check-in photo" },

  // Nearby
  "nb.title": { zh: "附近嘅朋友", en: "Friends nearby" },
  "nb.subtitle": { zh: "睇下邊個喺你附近", en: "See who is near you" },
  "nb.youAt": { zh: "你而家喺", en: "You're at" },
  "nb.location": { zh: "太古城 · 500 米範圍", en: "Taikoo Shing · within 500 m" },
  "nb.searching": { zh: "搵緊…", en: "Searching…" },
  "nb.again": { zh: "再搵一次", en: "Search again" },
  "nb.searchingTitle": { zh: "搵緊附近長者…", en: "Finding seniors nearby…" },
  "nb.foundPrefix": { zh: "搵到 ", en: "Found " },
  "nb.foundSuffix": { zh: " 位", en: "" },
  "nb.fewSec": { zh: "等幾秒就得", en: "Just a few seconds" },
  "nb.years": { zh: "歲", en: "yrs" },
  "nb.likes": { zh: "鍾意", en: "Likes" },
  "nb.km": { zh: "公里", en: "km" },
  "nb.m": { zh: "米", en: "m" },
  "nb.chat": { zh: "傾偈", en: "Chat" },
  "nb.privacyLabel": { zh: "私隱保護：", en: "Privacy: " },
  "nb.privacy": { zh: "我哋只會顯示大概位置，唔會話俾人知你住喺邊。", en: "Only approximate location is shown — your address stays private." },
  "nb.greeting1": { zh: "你好呀！我係", en: "Hi! I'm " },
  "nb.greeting2": { zh: "，我而家喺", en: ", I'm near " },
  "nb.greeting3": { zh: "附近 😊", en: " 😊" },
  "nb.autoReply": { zh: "好呀！不如一陣落嚟坐下傾偈？", en: "Sounds good! Want to come down and chat?" },
  "nb.typeMsg": { zh: "講句嘢…", en: "Say something…" },
  "nb.p.chan": { zh: "陳伯", en: "Mr. Chan" },
  "nb.p.mui": { zh: "梅姐", en: "Auntie Mui" },
  "nb.p.wong": { zh: "黃伯", en: "Mr. Wong" },
  "nb.p.yuk": { zh: "玉婆婆", en: "Granny Yuk" },
  "nb.p.keung": { zh: "強叔", en: "Uncle Keung" },
  "nb.p.lin": { zh: "蓮姐", en: "Auntie Lin" },
  "nb.pl.park": { zh: "樓下公園", en: "Park downstairs" },
  "nb.pl.cafe": { zh: "對面茶餐廳", en: "Cafe across the street" },
  "nb.pl.lobby": { zh: "屋苑大堂", en: "Estate lobby" },
  "nb.pl.market": { zh: "街市門口", en: "Wet market entrance" },
  "nb.pl.bus": { zh: "巴士站", en: "Bus stop" },
  "nb.pl.pavilion": { zh: "公園涼亭", en: "Park pavilion" },
  "nb.hb.chess": { zh: "下象棋", en: "Chinese chess" },
  "nb.hb.flower": { zh: "種花、傾偈", en: "Gardening & chats" },
  "nb.hb.opera": { zh: "聽粵曲", en: "Cantonese opera" },
  "nb.hb.soup": { zh: "煲湯、湊孫", en: "Soup-making & grandkids" },
  "nb.hb.news": { zh: "睇報紙", en: "Reading the news" },
  "nb.hb.dance": { zh: "跳廣場舞", en: "Square dancing" },

  // Rewards
  "rw.title": { zh: "換禮物", en: "Rewards" },
  "rw.subtitle": { zh: "用積分換日用品", en: "Redeem daily essentials" },
  "rw.points": { zh: "你嘅積分", en: "Your points" },
  "rw.unit": { zh: "分", en: "pts" },
  "rw.r.rice": { zh: "白米 5kg", en: "Rice 5kg" },
  "rw.r.eggs": { zh: "雞蛋 10 隻", en: "Eggs · 10" },
  "rw.r.oil": { zh: "食油 1L", en: "Cooking oil 1L" },
  "rw.r.tissue": { zh: "紙巾", en: "Tissue paper" },
  "rw.r.tea": { zh: "茶葉禮盒", en: "Tea gift box" },
  "rw.r.pharm": { zh: "藥房 $50 券", en: "Pharmacy $50 voucher" },
  "rw.b.wellcome": { zh: "惠康", en: "Wellcome" },
  "rw.b.parkn": { zh: "百佳", en: "ParknShop" },
  "rw.b.watsons": { zh: "屈臣氏", en: "Watsons" },
  "rw.b.ying": { zh: "英記", en: "Ying Kee" },
  "rw.b.mannings": { zh: "萬寧", en: "Mannings" },

  // Chat sample contacts
  "chat.c.grandSunny": { zh: "孫女 小晴", en: "Granddaughter · Sunny" },
  "chat.m.grandSunny": { zh: "婆婆，禮拜日去飲茶 ❤️", en: "Grandma, yum cha on Sunday ❤️" },
  "chat.c.sonChun": { zh: "細仔 阿俊", en: "Son · Chun" },
  "chat.m.sonChun": { zh: "媽，記得食藥呀", en: "Mum, remember your meds" },
  "chat.c.dauMei": { zh: "大女 美玲", en: "Daughter · Mei Ling" },
  "chat.m.dauMei": { zh: "今晚返嚟食飯", en: "Coming home for dinner tonight" },
  "chat.c.lee": { zh: "李婆婆", en: "Granny Lee" },
  "chat.m.lee": { zh: "好耐冇見啦～", en: "Long time no see~" },
  "chat.c.cheung": { zh: "象棋好友張伯", en: "Chess buddy Mr. Cheung" },
  "chat.m.cheung": { zh: "再來一局！", en: "One more game!" },
  "chat.c.wongtai": { zh: "鄰居 王太", en: "Neighbour Mrs. Wong" },
  "chat.m.wongtai": { zh: "落街買餸唔該叫埋我", en: "Call me when you go grocery shopping" },
  "chat.c.mahjong": { zh: "麻雀群組", en: "Mahjong group" },
  "chat.m.mahjong": { zh: "陳伯：今晚開枱嗎？", en: "Chan: A round tonight?" },
  "chat.c.walk": { zh: "公園散步團", en: "Park walking club" },
  "chat.m.walk": { zh: "明早 7 點集合", en: "Meet 7 AM tomorrow" },
  "chat.c.opera": { zh: "粵曲愛好者", en: "Opera fans" },
  "chat.m.opera": { zh: "周三聚會地點更新", en: "Wed gathering venue updated" },
  "chat.t.afternoon": { zh: "下午 3:10", en: "3:10 PM" },
  "chat.t.afternoon2": { zh: "下午 1:40", en: "1:40 PM" },
  "chat.t.morning": { zh: "上午 10:05", en: "10:05 AM" },
  "chat.t.afternoon3": { zh: "下午 1:15", en: "1:15 PM" },
  "chat.t.yesterday": { zh: "昨天", en: "Yesterday" },
  "chat.t.afternoon4": { zh: "下午 2:30", en: "2:30 PM" },
  "chat.t.morning2": { zh: "上午 11:20", en: "11:20 AM" },
  "chat.t.dayBefore": { zh: "前天", en: "Day before" },
  "chat.str.chan": { zh: "陳伯", en: "Mr. Chan" },
  "chat.str.mui": { zh: "梅姐", en: "Auntie Mui" },
  "chat.str.wong": { zh: "黃伯", en: "Mr. Wong" },
  "chat.str.yuk": { zh: "玉婆婆", en: "Granny Yuk" },
  "chat.str.from.kln": { zh: "九龍灣", en: "Kowloon Bay" },
  "chat.str.from.shatin": { zh: "沙田", en: "Sha Tin" },
  "chat.str.from.tsuen": { zh: "荃灣", en: "Tsuen Wan" },
  "chat.str.from.np": { zh: "北角", en: "North Point" },
  "chat.str.hb.chess": { zh: "下象棋、聽粵曲", en: "Chess & Cantonese opera" },
  "chat.str.hb.dance": { zh: "種花、跳廣場舞", en: "Gardening & square dancing" },
  "chat.str.hb.mj": { zh: "打麻雀、行山", en: "Mahjong & hiking" },
  "chat.str.hb.soup": { zh: "煲湯、湊孫", en: "Soup-making & grandkids" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("elderlink.lang");
      if (saved === "zh" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("elderlink.lang", l); } catch {}
  };

  const t = (k: string) => {
    const entry = dict[k];
    if (!entry) return k;
    return entry[lang];
  };

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
