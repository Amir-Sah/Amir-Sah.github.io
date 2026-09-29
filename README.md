# Portfolio v3

Vite multi-page site. Dark by default, follows the system light/dark setting.

```
npm install
npm run dev      # http://localhost:5190
npm run build    # static site in dist/, relative paths, deployable to any static host
```

- `index.html` home; `work/*.html` project pages (picked up by `vite.config.js` automatically).
- `partials/nav.html`, `partials/footer.html` are shared; `{{root}}` becomes the relative path to the site root.
- Images and the design-document PDF live in `public/assets/`.
- Libraries: Vite, PhotoSwipe (galleries), Fontsource (Bricolage Grotesque, Geist, Geist Mono), Phosphor icons.
