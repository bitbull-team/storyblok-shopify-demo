import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    spacing: {
      xl: '52px',
      xxl: '72px',
    },
    extend: {
      colors: {
        primary: {
          purple: {
            100: '#6F2FCE',
            50: '#B395E0',
            20: '#E4DAF4',
          },
          darkPurple: {
            100: '#2D1C30',
            70: '#644180',
            20: '#AFB0CD',
          },
        },
        neutral: {
          dark: {
            100: '#1C1C23',
            70: '#333340',
            30: '#85858D',
          },
          grey: {
            10: '#F0F0F0',
          },
          white: '#FFFFFF',
        },
        status: {
          error: '#DC3545',
          alert: '#FFCC99',
          success: '#89F6BB',
        },
      },
    },
  },
};
