import { resolve } from "path";
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { minify } from "html-minifier";
import { mdsvex }from 'mdsvex';
import slug from 'remark-slug';

// const { defineConfig } = require("vite");
import { defineConfig } from "vite"
const indexReplace = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return minify(html, {
        collapseWhitespace: true,
      });
    },
  };
};

export default defineConfig(({ command, mode }) => {

  const isProduction = mode === "production";
  return {
    build: {
      polyfillDynamicImport: false,
      cssCodeSplit: false,
      minify: isProduction,
    },

    optimizeDeps: {
      exclude: ["@roxi/routify"],
    },
    resolve: {
      dedupe: ['@roxi/routify'],
      alias: {
        svelte: resolve(__dirname, "node_modules/svelte"),
        '@': resolve(__dirname, './src')
      },
    },
    plugins: [

      svelte({
        //@ts-ignore
        hot: !isProduction,
        emitCss: true,
        extensions: ['.md', '.svx','.svelte'],
        preprocess: [
          mdsvex({
            remarkPlugins: [slug],
            extension: 'md',
          }),
        ],  
      }),
      indexReplace(),
    ],
  };
});