document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------
  const menuBtn = document.getElementById('menu-btn');
  const gnav = document.getElementById('gnav');

  const setMenu = (open) => {
    gnav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('is-locked', open);
  };

  menuBtn.addEventListener('click', () => {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  gnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenu(false);
  });

  // ---------------------------------------------------------
  // Reveal on scroll (content stays visible if JS / IO is unavailable)
  // ---------------------------------------------------------
  const targets = document.querySelectorAll('.reveal, .gantt');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('is-in'));
  }

  // ---------------------------------------------------------
  // Lightbox (images grouped by data-group)
  // ---------------------------------------------------------
  const dlg = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const prev = document.getElementById('lb-prev');
  const next = document.getElementById('lb-next');
  const closeBtn = document.getElementById('lb-close');
  let list = [];
  let idx = 0;

  const show = (i) => {
    idx = (i + list.length) % list.length;
    const fig = list[idx];
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = [cap ? cap.textContent : '', `${idx + 1} / ${list.length}`].filter(Boolean).join('  —  ');
  };

  const open = (fig) => {
    const group = fig.dataset.group;
    list = [...document.querySelectorAll(`[data-lb][data-group="${group}"]`)];
    dlg.toggleAttribute('data-single', list.length < 2);
    show(list.indexOf(fig));
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.body.classList.add('is-locked');
  };

  const close = () => {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  };

  document.querySelectorAll('[data-lb]').forEach((fig) => {
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', () => open(fig));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(fig);
      }
    });
  });

  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  closeBtn.addEventListener('click', close);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) close(); // backdrop area
  });
  dlg.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    lbImg.removeAttribute('src');
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // swipe on touch devices
  let sx = null;
  dlg.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (sx === null || list.length < 2) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
});
