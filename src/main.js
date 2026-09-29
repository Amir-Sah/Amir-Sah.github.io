const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll: sections appear in reading order. Siblings get a small stagger.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 4) * 0.08}s`);
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Home: mark the nav link of the section in view.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav [data-nav]');
if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((a) => {
          if (a.dataset.nav === entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}

// Trailer: load YouTube only when asked (faster page, no third-party requests until then).
const trailer = document.querySelector('[data-trailer]');
trailer?.querySelector('button')?.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${trailer.dataset.trailer}?autoplay=1&rel=0`;
  frame.title = trailer.dataset.title || 'Trailer';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  trailer.replaceChildren(frame);
});

// Galleries: PhotoSwipe, loaded only on pages that have one.
if (document.querySelector('[data-gallery]')) {
  import('photoswipe/lightbox').then(({ default: PhotoSwipeLightbox }) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '[data-gallery]',
      children: 'a',
      bgOpacity: 0.94,
      showHideAnimationType: reduceMotion ? 'none' : 'zoom',
      pswpModule: () => import('photoswipe'),
    });
    // Use the figure caption as the lightbox caption.
    lightbox.on('uiRegister', () => {
      lightbox.pswp.ui.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el, pswp) => {
          pswp.on('change', () => {
            const cap = pswp.currSlide.data.element?.closest('figure')?.querySelector('figcaption');
            el.textContent = cap ? cap.textContent.trim() : '';
          });
        },
      });
    });
    lightbox.init();
  });
}
