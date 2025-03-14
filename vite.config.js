import { defineConfig } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';

const banner = `/*!
 * favorites v${pkg.version}
 * https://github.com/VladimirIvanin/favorites/
 */`;

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'app/index.js'),
      name: 'Favorites',
      formats: ['umd'],
      fileName: () => 'favorites.js'
    },
    outDir: 'dist',
    // minify: false,
    rollupOptions: {
      output: {
        banner
      }
    }
  }
});