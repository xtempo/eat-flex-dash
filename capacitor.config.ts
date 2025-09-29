import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.23c98dbdac344c56a9d7559095400039',
  appName: 'eat-flex-dash',
  webDir: 'dist',
  server: {
    url: 'https://23c98dbd-ac34-4c56-a9d7-559095400039.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5A3C',
      showSpinner: false
    }
  }
};

export default config;