import { CapacitorConfig } from '@capacitor/cli';

// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.elderlink.app',
  appName: 'ElderLink',
  webDir: 'dist/client', // 👈 確保這裡有加 /client
  server: {
    androidScheme: 'http',
    allowNavigation: ['*']
  }
};

export default config;