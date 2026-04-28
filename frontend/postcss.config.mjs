const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Prevent excessive rebuilds
      optimize: {
        minify: false,
      },
    },
  },
};

export default config;
