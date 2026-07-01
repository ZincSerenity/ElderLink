import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Dwy_Iq-u.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useLang, a as useAuth, s as supabase } from "./router-FEBAZNos.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ArrowLeft, j as LoaderCircle, U as User, o as Camera, y as Save, z as Image } from "../_libs/lucide-react.mjs";
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
function AccountPage() {
  const {
    lang
  } = useLang();
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [avatar, setAvatar] = reactExports.useState(null);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = reactExports.useState(false);
  const albumInputRef = reactExports.useRef(null);
  const cameraInputRef = reactExports.useRef(null);
  const {
    data: profile,
    isLoading
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  reactExports.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setAvatar(profile.avatar_url || null);
    }
  }, [profile]);
  const processImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setShowPhotoOptions(false);
      toast.success(lang === "zh" ? "照片選取成功！記得點擊下方儲存按鈕。" : "Photo selected successfully! Remember to save changes.");
    };
    reader.readAsDataURL(file);
  };
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: avatar,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      await queryClient.invalidateQueries({
        queryKey: ["profile", user.id]
      });
      toast.success(lang === "zh" ? "個人資料儲存成功！" : "Profile changes saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 pt-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "w-11 h-11 rounded-full bg-secondary flex items-center justify-center transition active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display", children: lang === "zh" ? "帳戶設定" : "Account Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: lang === "zh" ? "自訂您的暱稱、頭像與簡介" : "Customize your nickname, photo and bio" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "正在讀取設定檔..." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveChanges, className: "px-5 mt-6 space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-28 rounded-full border-4 border-background bg-secondary text-primary font-display flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden shrink-0", children: avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatar, alt: "Avatar Preview", className: "w-full h-full object-cover" }) : displayName.slice(0, 1) || /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPhotoOptions(true), className: "absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md border-2 border-background active:scale-90 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3 font-medium", children: "點擊相機圖標更改頭像照片" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-base font-semibold text-foreground px-0.5", children: lang === "zh" ? "您的暱稱 / 顯示名稱" : "Your Nickname / Display Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, maxLength: 20, value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: lang === "zh" ? "請輸入名稱（例如：陳伯伯）" : "Enter display name...", className: "w-full bg-card border border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary text-base font-medium shadow-sm transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-base font-semibold text-foreground px-0.5", children: lang === "zh" ? "個人簡介 / 簽名檔" : "Personal Bio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, maxLength: 100, value: bio, onChange: (e) => setBio(e.target.value), placeholder: lang === "zh" ? "寫一點自我介紹，讓家人更了解您的近況..." : "Write a short bio about yourself...", className: "w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary text-base font-medium shadow-sm transition resize-none leading-relaxed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isSaving || !displayName.trim(), className: "w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-primary-foreground font-display text-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50", children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" }),
        lang === "zh" ? "儲存更新修改" : "Save Profile Changes"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: albumInputRef, type: "file", accept: "image/*", hidden: true, onChange: processImageFile }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: cameraInputRef, type: "file", accept: "image/*", capture: "user", hidden: true, onChange: processImageFile }),
    showPhotoOptions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3 border border-border animate-in slide-in-from-bottom duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center pb-2 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground", children: lang === "zh" ? "更換頭像相片" : "Update Profile Picture" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "請選擇您方便的相片載入方式" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => cameraInputRef.current?.click(), className: "w-full py-4 bg-primary text-primary-foreground font-display text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-6 h-6" }),
        lang === "zh" ? "啟動相機現場影相 (自拍)" : "Take Live Photo (Selfie)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => albumInputRef.current?.click(), className: "w-full py-4 bg-secondary text-foreground font-semibold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-6 h-6 text-primary" }),
        lang === "zh" ? "從手機相簿選取現成照片" : "Choose From Photo Album"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPhotoOptions(false), className: "w-full py-3.5 text-muted-foreground font-medium text-base hover:text-foreground transition text-center pt-2", children: lang === "zh" ? "取消放棄變更" : "Cancel" })
    ] }) })
  ] });
}
export {
  AccountPage as component
};
