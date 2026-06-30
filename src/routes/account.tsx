import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/local_client";
import { 
  ArrowLeft, User, Camera, Image, 
  Loader2, Save 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { lang } = useLang();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 表單可編輯狀態
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // 隱藏的檔案輸入節點引用 (Refs)
  const albumInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 1. 透過 React Query 讀取最新的個人資料
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // 當資料庫載入完成後，同步到本地輸入框狀態
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setAvatar(profile.avatar_url || null);
    }
  }, [profile]);

  // 轉換圖片檔案為 Base64 字串以供快速儲存
  const processImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
      setShowPhotoOptions(false);
      toast.success(lang === "zh" ? "照片選取成功！記得點擊下方儲存按鈕。" : "Photo selected successfully! Remember to save changes.");
    };
    reader.readAsDataURL(file);
  };

  // 2. 將修改後的欄位資料更新（Upsert）回 Supabase 資料表
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: displayName.trim(),
          bio: bio.trim(),
          avatar_url: avatar,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // 即時重整 React Query 緩存，讓導航列大頭貼與暱稱瞬間同步更新
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success(lang === "zh" ? "個人資料儲存成功！" : "Profile changes saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      {/* 頁面頂部標題列 */}
      <section className="px-5 pt-6 flex items-center gap-3">
        <Link to="/" className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center transition active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-display">{lang === "zh" ? "帳戶設定" : "Account Settings"}</h1>
          <p className="text-muted-foreground">{lang === "zh" ? "自訂您的暱稱、頭像與簡介" : "Customize your nickname, photo and bio"}</p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">正在讀取設定檔...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveChanges} className="px-5 mt-6 space-y-6 animate-in fade-in duration-200">
          
          {/* 大頭貼互動選取區域 */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-background bg-secondary text-primary font-display flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  displayName.slice(0, 1) || <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoOptions(true)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md border-2 border-background active:scale-90 transition"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">點擊相機圖標更改頭像照片</p>
          </div>

          {/* 文字欄位輸入區 */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-base font-semibold text-foreground px-0.5">
                {lang === "zh" ? "您的暱稱 / 顯示名稱" : "Your Nickname / Display Name"}
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={lang === "zh" ? "請輸入名稱（例如：陳伯伯）" : "Enter display name..."}
                className="w-full bg-card border border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary text-base font-medium shadow-sm transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-semibold text-foreground px-0.5">
                {lang === "zh" ? "個人簡介 / 簽名檔" : "Personal Bio"}
              </label>
              <textarea
                rows={3}
                maxLength={100}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={lang === "zh" ? "寫一點自我介紹，讓家人更了解您的近況..." : "Write a short bio about yourself..."}
                className="w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary text-base font-medium shadow-sm transition resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* 儲存提交按鈕 */}
          <button
            type="submit"
            disabled={isSaving || !displayName.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {lang === "zh" ? "儲存更新修改" : "Save Profile Changes"}
              </>
            )}
          </button>
        </form>
      )}

      {/* 隱藏的原生檔案觸發器 */}
      {/* 1. 相簿選取 */}
      <input 
        ref={albumInputRef} 
        type="file" 
        accept="image/*" 
        hidden 
        onChange={processImageFile} 
      />
      {/* 2. 相機自拍 */}
      <input 
        ref={cameraInputRef} 
        type="file" 
        accept="image/*" 
        capture="user" 
        hidden 
        onChange={processImageFile} 
      />

      {/* 底部彈出的相片操作面板 (Drawer Modal) */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-background w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3 border border-border animate-in slide-in-from-bottom duration-200">
            <div className="text-center pb-2 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">{lang === "zh" ? "更換頭像相片" : "Update Profile Picture"}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">請選擇您方便的相片載入方式</p>
            </div>

            {/* 相機拍照 */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full py-4 bg-primary text-primary-foreground font-display text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition"
            >
              <Camera className="w-6 h-6" />
              {lang === "zh" ? "啟動相機現場影相 (自拍)" : "Take Live Photo (Selfie)"}
            </button>

            {/* 本地相簿 */}
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="w-full py-4 bg-secondary text-foreground font-semibold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition border border-border"
            >
              <Image className="w-6 h-6 text-primary" />
              {lang === "zh" ? "從手機相簿選取現成照片" : "Choose From Photo Album"}
            </button>

            {/* 取消按鈕 */}
            <button
              type="button"
              onClick={() => setShowPhotoOptions(false)}
              className="w-full py-3.5 text-muted-foreground font-medium text-base hover:text-foreground transition text-center pt-2"
            >
              {lang === "zh" ? "取消放棄變更" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}