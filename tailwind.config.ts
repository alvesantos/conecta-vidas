import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx,js,jsx}',
    './components/**/*.{vue,ts,tsx,js,jsx}',
    './layouts/**/*.{vue,ts,tsx,js,jsx}',
    './pages/**/*.{vue,ts,tsx,js,jsx}',
    './plugins/**/*.{ts,js}',
  ],
} satisfies Config
