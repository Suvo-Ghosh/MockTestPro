// src/app/manifest.js
export default function manifest() {
  return {
    id: '/dashboard',
    name: 'MockTestPro',
    short_name: 'MockTestPro',
    description: 'The ultimate mock test platform for competitive exams.',
    start_url: '/dashboard', // Drops them right into the tests when they open the app
    display: 'standalone',   // Hides the browser URL bar for a native app feel
    background_color: '#ffffff', // Tailwind white
    theme_color: '#2563eb',      // Tailwind blue-600
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  }
}