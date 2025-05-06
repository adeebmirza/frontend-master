module.exports = {
    darkMode: 'class',  // enables dark mode class
    theme: {
      extend: {
        keyframes: {
          slideInLeft: {
            '0%': { transform: 'translateX(-20px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(20px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
        },
        animation: {
          slideInLeft: 'slideInLeft 0.3s ease-out forwards',
          slideInRight: 'slideInRight 0.3s ease-out forwards',
        },
      },
    },
    plugins: [],
  };
  