import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-color, #0EA5E9)',
                dark: '#0F172A',
                light: 'var(--bg-color, #F8FAFC)',
                accent: '#38BDF8',
                success: '#22C55E',
            },
            fontFamily: {
                sans: ['var(--font-family)', 'var(--font-inter)', 'sans-serif'],
            },
            borderRadius: {
                'xl': 'var(--border-radius-xl, 1rem)',
            },
            boxShadow: {
                'soft': 'var(--shadow-soft, 0 4px 20px -2px rgba(0, 0, 0, 0.05))',
            }
        },
    },
    plugins: [],
}

export default config
