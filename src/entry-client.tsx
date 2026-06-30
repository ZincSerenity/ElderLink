// src/entry-client.tsx
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router' // 確保指向你昨天修改好的 router.tsx

const rootElement = document.getElementById('root')

if (rootElement) {
  // 👈 終極修正：在手機/Capacitor 環境下，直接使用標準的 RouterProvider 渲染
  // 這會徹底跳過所有 TanStack Start 的伺服器水合檢查，100% 消除 Invariant failed 崩潰！
  createRoot(rootElement).render(<RouterProvider router={router} />)
}