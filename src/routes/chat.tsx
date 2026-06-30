import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";
import { 
  MessageCircle, Plus, Search, Mic, MicOff, Send, 
  User, Loader2, X, Users, ArrowLeft, Info
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({ component: ChatPage });

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface OnlineUser {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
}

function ChatPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetName, setTargetName] = useState("");
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  
  // View other user's profile card modal state
  const [viewingProfile, setViewingProfile] = useState<OnlineUser | null>(null);
  
  // Realtime Online Active Users State
  const [actualActiveUsers, setActualActiveUsers] = useState<OnlineUser[]>([]);
  const [isPresenceLoading, setIsPresenceLoading] = useState(true);
  
  // Active Chat Window States
  const [activeChatUser, setActiveChatUser] = useState<OnlineUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. SUPABASE REALTIME PRESENCE ENGINE (已全面修正 TypeScript 閉包與型別錯誤)
  useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) return;

    let channel: any;

    async function setupPresence() {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, bio")
        .eq("id", currentUserId)
        .single();
      
      const myName = profile?.display_name || "用戶";
      const myAvatar = profile?.avatar_url || null;
      const myBio = profile?.bio || "";

      channel = supabase.channel("online-lobby", {
        config: {
          presence: {
            key: currentUserId,
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const presenceState = channel.presenceState();
          const allPresences = Object.values(presenceState).flat() as any[];
          
          const uniqueOnlineUsers = Array.from(
            new Map(allPresences.map(p => [p.user_id, p])).values()
          )
            .filter((p: any) => p.user_id !== currentUserId)
            .map((p: any) => ({
              id: p.user_id,
              display_name: p.display_name || "未命名用戶",
              avatar_url: p.avatar_url,
              bio: p.bio,
            }));

          setActualActiveUsers(uniqueOnlineUsers);
          setIsPresenceLoading(false);
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: currentUserId,
              display_name: myName,
              avatar_url: myAvatar,
              bio: myBio,
              online_at: new Date().toISOString(),
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

  // 2. 載入對話訊息
  const { data: allMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["chat_messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // 3. 下載完整用戶快照
  const { data: allProfiles } = useQuery({
    queryKey: ["all_profiles_snapshot"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, bio");
      return data || [];
    },
  });

  // 根據動態訊息記錄，自動計算出聯絡人列表
  const chatList = useMemo(() => {
    if (!allMessages || !allProfiles) return [];
    
    const interactedUserIds = new Set<string>();
    allMessages.forEach(m => {
      if (m.sender_id === user?.id) interactedUserIds.add(m.receiver_id);
      if (m.receiver_id === user?.id) interactedUserIds.add(m.sender_id);
    });

    return allProfiles
      .filter(u => interactedUserIds.has(u.id) && u.id !== user?.id)
      .map(u => {
        const userMsgs = allMessages.filter(m => 
          (m.sender_id === user?.id && m.receiver_id === u.id) ||
          (m.sender_id === u.id && m.receiver_id === user?.id)
        );
        const lastMsg = userMsgs[userMsgs.length - 1];
        return {
          ...u,
          lastMessage: lastMsg ? lastMsg.content : "",
          time: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
        };
      });
  }, [allMessages, allProfiles, user?.id]);

  const currentChatMessages = useMemo(() => {
    if (!activeChatUser || !allMessages) return [];
    return allMessages.filter(m => 
      (m.sender_id === user?.id && m.receiver_id === activeChatUser.id) ||
      (m.sender_id === activeChatUser.id && m.receiver_id === user?.id)
    );
  }, [allMessages, activeChatUser, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  // 功能 1：透過暱稱精準查找好友
  const handleAddUserByName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim()) return;
    setIsSearchingUser(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, bio")
        .eq("display_name", targetName.trim())
        .maybeSingle();

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
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSearchingUser(false);
    }
  };

  // 功能 2：廣東話 / 英文 語音輸入
  const handleVoiceSearch = () => {
    const customWindow = window as SpeechRecognitionWindow;
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

    recognition.onresult = (event: any) => {
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

  // 功能 3：發送對話訊息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser || !user?.id) return;
    setIsSending(true);

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: activeChatUser.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
      await refetchMessages();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const filteredChatList = chatList.filter(c => 
    c.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      {!activeChatUser ? (
        /* 主列表介面 */
        <div className="flex flex-col min-h-[calc(100vh-160px)] animate-in fade-in duration-200">
          <section className="px-5 pt-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display">{t("chat.title") || "互動傾偈"}</h1>
              <p className="text-muted-foreground mt-1">與您的家人或在線社群長者即時聊天</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition shadow-primary/20"
            >
              <Plus className="w-6 h-6" />
            </button>
          </section>

          {/* 搜尋欄位組件 */}
          <section className="px-5 mt-4">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "zh" ? "搜尋聯絡人或對話..." : "Search contacts..."}
                  className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-primary text-base"
                />
              </div>
              <button
                onClick={handleVoiceSearch}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition shadow-sm shrink-0 ${
                  isListening 
                    ? "bg-red-500 border-red-500 text-white animate-pulse" 
                    : "bg-card border-border text-primary hover:bg-secondary"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </section>

          {/* 實時在線活躍用戶面板 */}
          <section className="px-5 mt-6">
            <div className="bg-muted/60 border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-3">
                <Users className="w-4 h-4" />
                <span>{lang === "zh" ? "網頁當前在線上的活躍用戶" : "Users online right now"}</span>
              </div>
              {isPresenceLoading ? (
                <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>正在偵測實時在線頻道...</span>
                </div>
              ) : actualActiveUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {actualActiveUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => setActiveChatUser(u)}
                      className="px-3 py-1.5 bg-card border border-border rounded-full text-sm font-medium hover:border-primary transition flex items-center gap-1.5 shadow-sm"
                    >
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                      ) : (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      )}
                      {u.display_name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {lang === "zh" 
                    ? "目前沒有其他人在線（實時頻道運作正常：因為您目前是唯一打開網站的使用者）" 
                    : "No other users are currently browsing the site (you are currently the only active visitor)."}
                </p>
              )}
            </div>
          </section>

          {/* 最近聊天歷史紀錄 */}
          <section className="px-5 mt-6 flex-1">
            <h2 className="text-xl font-display mb-3">{lang === "zh" ? "最近對話" : "Recent Chats"}</h2>
            {filteredChatList.length > 0 ? (
              <div className="space-y-2.5">
                {filteredChatList.map((chat) => (
                  <div
                    key={chat.id}
                    className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary transition text-left shadow-sm relative group"
                  >
                    <button
                      type="button"
                      title={lang === "zh" ? "查看個人檔案" : "View profile"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingProfile(chat);
                      }}
                      className="w-12 h-12 rounded-full border border-border bg-secondary text-primary font-display flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden active:scale-90 transition relative z-10"
                    >
                      {chat.avatar_url ? (
                        <img src={chat.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        chat.display_name?.slice(0, 1)
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveChatUser(chat)}
                      className="flex-1 min-w-0 text-left h-full"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-base text-foreground truncate">{chat.display_name}</p>
                        <span className="text-xs text-muted-foreground font-medium shrink-0">{chat.time}</span>
                      </div>
                      <p className="text-muted-foreground text-sm truncate mt-0.5">{chat.lastMessage}</p>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl bg-card/40 mt-2">
                <MessageCircle className="w-10 h-10 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm font-medium">
                  {searchQuery ? "找不到相符的聯絡人" : "目前未有任何聊天歷史記錄"}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  點擊右上角 <span className="font-bold text-primary">+</span> 按鈕輸入暱稱，即可開啟全新對話！
                </p>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* 聊天視窗 */
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right duration-200 bg-background">
          <div className="px-5 py-4 bg-card border-b border-border flex items-center gap-3">
            <button 
              onClick={() => setActiveChatUser(null)}
              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground transition shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => setViewingProfile(activeChatUser)}
              className="w-10 h-10 rounded-full border border-border bg-primary text-primary-foreground font-display flex items-center justify-center text-base font-bold shrink-0 overflow-hidden active:scale-95 transition"
            >
              {activeChatUser.avatar_url ? (
                <img src={activeChatUser.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                activeChatUser.display_name?.slice(0, 1)
              )}
            </button>
            
            <div className="flex-1 min-w-0 text-left" onClick={() => setViewingProfile(activeChatUser)}>
              <h3 className="font-semibold text-lg text-foreground truncate flex items-center gap-1.5 cursor-pointer hover:text-primary transition">
                {activeChatUser.display_name}
                <Info className="w-4 h-4 text-muted-foreground" />
              </h3>
              <p className="text-xs text-emerald-600 font-medium">● 連線通訊中</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/20">
            {currentChatMessages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed ${
                    isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-card border-t border-border flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition shrink-0 ${
                isListening 
                  ? "bg-red-500 border-red-500 text-white animate-pulse" 
                  : "bg-secondary border-transparent text-primary hover:bg-muted"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={lang === "zh" ? "請輸入或使用語音說出訊息..." : "Type or speak a message..."}
              className="flex-1 bg-muted/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-base"
            />
            
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow transition active:scale-95 disabled:opacity-40 shrink-0"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}

      {/* 新增對話 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-sm rounded-2xl border border-border p-5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-xl font-display font-bold">添加聊天對話</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUserByName} className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">請輸入你想要對話的用戶暱稱（顯示名稱）：</p>
              <input
                type="text"
                required
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="例如: 王伯伯 / test"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-base"
              />
              <button
                type="submit"
                disabled={isSearchingUser || !targetName.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSearchingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                確定添加
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 查看其他用戶個人檔案的名片視窗 */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-sm rounded-3xl border border-border p-6 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-24 h-24 rounded-full border-4 border-background bg-secondary text-primary font-display flex items-center justify-center text-3xl font-bold shadow-md mx-auto overflow-hidden shrink-0 mt-2">
              {viewingProfile.avatar_url ? (
                <img src={viewingProfile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                viewingProfile.display_name?.slice(0, 1)
              )}
            </div>

            <h4 className="text-2xl font-display font-bold text-foreground mt-4">{viewingProfile.display_name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">ElderLink 社群成員</p>

            <div className="bg-muted/50 rounded-2xl p-4 mt-4 text-left border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">個人簡介</p>
              <p className="text-foreground text-sm font-medium leading-relaxed mt-1 whitespace-pre-line">
                {viewingProfile.bio?.trim() || (lang === "zh" ? "這個人很懶，什麼都沒留下。" : "No bio provided yet.")}
              </p>
            </div>

            <button
              onClick={() => {
                setActiveChatUser(viewingProfile);
                setViewingProfile(null);
              }}
              className="w-full mt-5 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md active:scale-95 transition text-base"
            >
              {lang === "zh" ? "發送訊息" : "Send Message"}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}