import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, q as Search, r as MicOff, s as Mic, k as Users, j as LoaderCircle, M as MessageCircle, A as ArrowLeft, I as Info, g as Send, X } from "../_libs/lucide-react.mjs";
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
function ChatPage() {
  const {
    t,
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  useQueryClient();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isListening, setIsListening] = reactExports.useState(false);
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [targetName, setTargetName] = reactExports.useState("");
  const [isSearchingUser, setIsSearchingUser] = reactExports.useState(false);
  const [viewingProfile, setViewingProfile] = reactExports.useState(null);
  const [actualActiveUsers, setActualActiveUsers] = reactExports.useState([]);
  const [isPresenceLoading, setIsPresenceLoading] = reactExports.useState(true);
  const [activeChatUser, setActiveChatUser] = reactExports.useState(null);
  const [newMessage, setNewMessage] = reactExports.useState("");
  const [isSending, setIsSending] = reactExports.useState(false);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) return;
    let channel;
    async function setupPresence() {
      const {
        data: profile
      } = await supabase.from("profiles").select("display_name, avatar_url, bio").eq("id", currentUserId).single();
      const myName = profile?.display_name || "用戶";
      const myAvatar = profile?.avatar_url || null;
      const myBio = profile?.bio || "";
      channel = supabase.channel("online-lobby", {
        config: {
          presence: {
            key: currentUserId
          }
        }
      });
      channel.on("presence", {
        event: "sync"
      }, () => {
        const presenceState = channel.presenceState();
        const allPresences = Object.values(presenceState).flat();
        const uniqueOnlineUsers = Array.from(new Map(allPresences.map((p) => [p.user_id, p])).values()).filter((p) => p.user_id !== currentUserId).map((p) => ({
          id: p.user_id,
          display_name: p.display_name || "未命名用戶",
          avatar_url: p.avatar_url,
          bio: p.bio
        }));
        setActualActiveUsers(uniqueOnlineUsers);
        setIsPresenceLoading(false);
      }).subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: currentUserId,
            display_name: myName,
            avatar_url: myAvatar,
            bio: myBio,
            online_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      });
    }
    setupPresence();
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);
  const {
    data: allMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ["chat_messages", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("messages").select("*").or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`).order("created_at", {
        ascending: true
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  const {
    data: allProfiles
  } = useQuery({
    queryKey: ["all_profiles_snapshot"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("id, display_name, avatar_url, bio");
      return data || [];
    }
  });
  const chatList = reactExports.useMemo(() => {
    if (!allMessages || !allProfiles) return [];
    const interactedUserIds = /* @__PURE__ */ new Set();
    allMessages.forEach((m) => {
      if (m.sender_id === user?.id) interactedUserIds.add(m.receiver_id);
      if (m.receiver_id === user?.id) interactedUserIds.add(m.sender_id);
    });
    return allProfiles.filter((u) => interactedUserIds.has(u.id) && u.id !== user?.id).map((u) => {
      const userMsgs = allMessages.filter((m) => m.sender_id === user?.id && m.receiver_id === u.id || m.sender_id === u.id && m.receiver_id === user?.id);
      const lastMsg = userMsgs[userMsgs.length - 1];
      return {
        ...u,
        lastMessage: lastMsg ? lastMsg.content : "",
        time: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }) : ""
      };
    });
  }, [allMessages, allProfiles, user?.id]);
  const currentChatMessages = reactExports.useMemo(() => {
    if (!activeChatUser || !allMessages) return [];
    return allMessages.filter((m) => m.sender_id === user?.id && m.receiver_id === activeChatUser.id || m.sender_id === activeChatUser.id && m.receiver_id === user?.id);
  }, [allMessages, activeChatUser, user?.id]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [currentChatMessages]);
  const handleAddUserByName = async (e) => {
    e.preventDefault();
    if (!targetName.trim()) return;
    setIsSearchingUser(true);
    try {
      const {
        data,
        error
      } = await supabase.from("profiles").select("id, display_name, avatar_url, bio").eq("display_name", targetName.trim()).maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error(lang === "zh" ? "找不到該用戶，請檢查名稱是否正確" : "User not found, please check the name.");
      } else if (data.id === user?.id) {
        toast.error(lang === "zh" ? "不能添加自己為好友" : "You cannot add yourself.");
      } else {
        toast.success(lang === "zh" ? `成功與 ${data.display_name} 建立對話！` : `Connected with ${data.display_name}!`);
        setActiveChatUser(data);
        setShowAddModal(false);
        setTargetName("");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSearchingUser(false);
    }
  };
  const handleVoiceSearch = () => {
    const customWindow = window;
    const SpeechRecognition = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(lang === "zh" ? "您的瀏覽器不支援語音辨識功能" : "Speech recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === "zh" ? "zh-HK" : "en-US";
    recognition.onstart = () => {
      setIsListening(true);
      toast(lang === "zh" ? "正在聆聽廣東話...請講話" : "Listening for English... please speak");
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error(lang === "zh" ? "語音辨識失敗，請再試一次" : "Voice recognition failed.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      if (activeChatUser) {
        setNewMessage(resultText);
      } else {
        setSearchQuery(resultText);
      }
      toast.success(lang === "zh" ? `辨識成功: "${resultText}"` : `Identified: "${resultText}"`);
    };
    recognition.start();
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser || !user?.id) return;
    setIsSending(true);
    try {
      const {
        error
      } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: activeChatUser.id,
        content: newMessage.trim()
      });
      if (error) throw error;
      setNewMessage("");
      await refetchMessages();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };
  const filteredChatList = chatList.filter((c) => c.display_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    !activeChatUser ? (
      /* 主列表介面 */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[calc(100vh-160px)] animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: t("chat.title") || "互動傾偈" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "與您的家人或在線社群長者即時聊天" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAddModal(true), className: "w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition shadow-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: lang === "zh" ? "搜尋聯絡人或對話..." : "Search contacts...", className: "w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-primary text-base" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleVoiceSearch, className: `w-12 h-12 rounded-2xl flex items-center justify-center border transition shadow-sm shrink-0 ${isListening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-card border-border text-primary hover:bg-secondary"}`, children: isListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/60 border border-border rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground font-medium mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "zh" ? "網頁當前在線上的活躍用戶" : "Users online right now" })
          ] }),
          isPresenceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "正在偵測實時在線頻道..." })
          ] }) : actualActiveUsers.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: actualActiveUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveChatUser(u), className: "px-3 py-1.5 bg-card border border-border rounded-full text-sm font-medium hover:border-primary transition flex items-center gap-1.5 shadow-sm", children: [
            u.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar_url, alt: "", className: "w-4 h-4 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-emerald-500 rounded-full animate-ping" }),
            u.display_name
          ] }, u.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic leading-relaxed", children: lang === "zh" ? "目前沒有其他人在線（實時頻道運作正常：因為您目前是唯一打開網站的使用者）" : "No other users are currently browsing the site (you are currently the only active visitor)." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display mb-3", children: lang === "zh" ? "最近對話" : "Recent Chats" }),
          filteredChatList.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: filteredChatList.map((chat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary transition text-left shadow-sm relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", title: lang === "zh" ? "查看個人檔案" : "View profile", onClick: (e) => {
              e.stopPropagation();
              setViewingProfile(chat);
            }, className: "w-12 h-12 rounded-full border border-border bg-secondary text-primary font-display flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden active:scale-90 transition relative z-10", children: chat.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chat.avatar_url, alt: "Profile", className: "w-full h-full object-cover" }) : chat.display_name?.slice(0, 1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveChatUser(chat), className: "flex-1 min-w-0 text-left h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-base text-foreground truncate", children: chat.display_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium shrink-0", children: chat.time })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm truncate mt-0.5", children: chat.lastMessage })
            ] })
          ] }, chat.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 border border-dashed border-border rounded-3xl bg-card/40 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-10 h-10 text-muted-foreground/60 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-medium", children: searchQuery ? "找不到相符的聯絡人" : "目前未有任何聊天歷史記錄" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/80 mt-1", children: [
              "點擊右上角 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: "+" }),
              " 按鈕輸入暱稱，即可開啟全新對話！"
            ] })
          ] })
        ] })
      ] })
    ) : (
      /* 聊天視窗 */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right duration-200 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 bg-card border-b border-border flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveChatUser(null), className: "w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground transition shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setViewingProfile(activeChatUser), className: "w-10 h-10 rounded-full border border-border bg-primary text-primary-foreground font-display flex items-center justify-center text-base font-bold shrink-0 overflow-hidden active:scale-95 transition", children: activeChatUser.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeChatUser.avatar_url, alt: "", className: "w-full h-full object-cover" }) : activeChatUser.display_name?.slice(0, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-left", onClick: () => setViewingProfile(activeChatUser), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg text-foreground truncate flex items-center gap-1.5 cursor-pointer hover:text-primary transition", children: [
              activeChatUser.display_name,
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600 font-medium", children: "● 連線通訊中" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/20", children: [
          currentChatMessages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${isMe ? "items-end" : "items-start"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed ${isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border text-foreground rounded-tl-none"}`, children: msg.content }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground mt-1 px-1 font-medium", children: new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ] }, msg.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendMessage, className: "p-4 bg-card border-t border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleVoiceSearch, className: `w-12 h-12 rounded-xl flex items-center justify-center border transition shrink-0 ${isListening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-secondary border-transparent text-primary hover:bg-muted"}`, children: isListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newMessage, onChange: (e) => setNewMessage(e.target.value), placeholder: lang === "zh" ? "請輸入或使用語音說出訊息..." : "Type or speak a message...", className: "flex-1 bg-muted/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-base" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !newMessage.trim() || isSending, className: "w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow transition active:scale-95 disabled:opacity-40 shrink-0", children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5" }) })
        ] })
      ] })
    ),
    showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background w-full max-w-sm rounded-2xl border border-border p-5 shadow-xl animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold", children: "添加聊天對話" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAddModal(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddUserByName, className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "請輸入你想要對話的用戶暱稱（顯示名稱）：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: targetName, onChange: (e) => setTargetName(e.target.value), placeholder: "例如: 王伯伯 / test", className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-base" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: isSearchingUser || !targetName.trim(), className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50", children: [
          isSearchingUser && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "確定添加"
        ] })
      ] })
    ] }) }),
    viewingProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background w-full max-w-sm rounded-3xl border border-border p-6 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingProfile(null), className: "absolute top-4 right-4 w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full border-4 border-background bg-secondary text-primary font-display flex items-center justify-center text-3xl font-bold shadow-md mx-auto overflow-hidden shrink-0 mt-2", children: viewingProfile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: viewingProfile.avatar_url, alt: "", className: "w-full h-full object-cover" }) : viewingProfile.display_name?.slice(0, 1) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-display font-bold text-foreground mt-4", children: viewingProfile.display_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "ElderLink 社群成員" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-2xl p-4 mt-4 text-left border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "個人簡介" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm font-medium leading-relaxed mt-1 whitespace-pre-line", children: viewingProfile.bio?.trim() || (lang === "zh" ? "這個人很懶，什麼都沒留下。" : "No bio provided yet.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setActiveChatUser(viewingProfile);
        setViewingProfile(null);
      }, className: "w-full mt-5 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md active:scale-95 transition text-base", children: lang === "zh" ? "發送訊息" : "Send Message" })
    ] }) })
  ] });
}
export {
  ChatPage as component
};
