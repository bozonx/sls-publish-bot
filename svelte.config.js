import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";


/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    appDir: 'app',
    adapter: adapter({
      pages: "build",
      assets: "build",
      //fallback: '404.html',
      precompress: false,
      strict: true,
    }),

    paths: {
      relative: false,
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
    },

    //target: "#svelte",
  },

  concurrency: 3,
};

export default config;
