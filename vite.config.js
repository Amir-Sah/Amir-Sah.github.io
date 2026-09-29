import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';

const root = import.meta.dirname;
const read = (p) => readFileSync(resolve(root, p), 'utf8');

// Icon sprite built from Phosphor (regular weight, MIT). Only the glyphs the site uses.
const ICONS = ['arrow-up-right', 'arrow-left', 'arrow-right', 'play', 'file-pdf', 'linkedin-logo', 'envelope-simple', 'game-controller', 'github-logo'];
const sprite =
  '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
  ICONS.map((name) => {
    const svg = read(`node_modules/@phosphor-icons/core/assets/regular/${name}.svg`);
    const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<symbol id="i-${name}" viewBox="0 0 256 256">${inner}</symbol>`;
  }).join('') +
  '</svg>';

// Every page under /work is a project page.
const pages = {
  index: resolve(root, 'index.html'),
  404: resolve(root, '404.html'),
  ...Object.fromEntries(
    readdirSync(resolve(root, 'work'))
      .filter((f) => f.endsWith('.html'))
      .map((f) => [`work/${f.replace('.html', '')}`, resolve(root, 'work', f)])
  ),
};

// Shared partials: <!-- @icons -->, <!-- @nav -->, <!-- @footer -->, and {{root}} (relative path back to the site root).
function partials() {
  return {
    name: 'partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const depth = relative(root, dirname(ctx.filename)).split(/[\\/]/).filter(Boolean).length;
        const up = depth ? '../'.repeat(depth) : './';
        return html
          .replace('<!-- @icons -->', sprite)
          .replace('<!-- @nav -->', read('partials/nav.html'))
          .replace('<!-- @footer -->', read('partials/footer.html'))
          .replaceAll('{{root}}', up);
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [partials()],
  build: { rollupOptions: { input: pages } },
  server: { port: 5190 },
});
