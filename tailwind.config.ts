import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#25f46a',
        'background-light': '#f5f8f6',
        'background-dark': '#102216',
        'card-dark': '#1E293B',
        'input-bg': '#28392e',
        'input-icon': '#9cbaa6',
        matematica: '#FF7B25',
        ciencias: '#10B981',
        portugues: '#4F46E5',
        historia: '#FBBF24',
        geografia: '#22D3EE',
        artes: '#EC4899',
        // Cores para painel do professor
        'surface-dark': '#16213E',
        'text-light': '#1A1A2E',
        'text-dark': '#F0F0F0',
        'text-secondary-dark': '#A9A9A9',
        // Cores para tela de boas-vindas
        'welcome-primary': '#FBBF24', // Amarelo vibrante
        'welcome-secondary': '#38BDF8', // Azul claro
        'welcome-bg-dark': '#1F2937', // Cinza-azulado escuro
        // Cores para perfil do aluno
        'brand-lime': '#A7F3D0',
        'brand-pink': '#F9A8D4',
        'brand-cyan': '#A5F3FC',
        'profile-primary': '#42A5F5',
        'profile-secondary': '#FFCA28',
        // Cores para lições interativas
        'success': '#25f46a',
        'error': '#ff4d4d',
        'border-dark': '#4b5563',
        // Cores para painel dos pais
        'pais-primary': '#13ecec',
        'pais-bg-dark': '#102222',
        // Cores para chat
        'message-sender': '#282e39',
        'chat-primary': '#0d59f2',
        // Cores para coordenador
        'coordenador-primary': '#137fec',
        'coordenador-bg-dark': '#101922',
        // Cores para ranking e amigos
        'accept': '#58CC02',
        'decline': '#FF4B4B',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
export default config

