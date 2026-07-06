document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // Smooth scroll implementation
  // -------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    });
  });

  // -------------------------------------------------------------
  // Simple Fade-in animation on scroll (元のコードで途切れていた部分を補完)
  // -------------------------------------------------------------
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-4');
        // 一度発火したら監視を解除する場合
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // アニメーション対象の要素を監視（例としてsectionタグを対象化）
  document.querySelectorAll('section').forEach((section) => {
    section.classList.add(
      'opacity-0',
      'translate-y-4',
      'transition-all',
      'duration-700',
    );
    observer.observe(section);
  });

  // -------------------------------------------------------------
  // Project Modal Logic
  // -------------------------------------------------------------
  const modal = document.getElementById('project-modal');
  const modalContent = modal.querySelector('.relative');
  const closeBtn = document.getElementById('close-modal');
  const backdrop = document.getElementById('modal-backdrop');

  if (modal && closeBtn && backdrop) {
    const openModal = (data) => {
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-image').src = data.image;
      document.getElementById('modal-image').alt = data.title;
      document.getElementById('modal-description').innerHTML = data.description;
      document.getElementById('modal-link').href = data.link;

      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = '';
      data.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className =
          'px-3 py-1 bg-primary/10 text-primary rounded-full text-label-md font-bold';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      modal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-95');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalContent.classList.add('scale-95');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-project]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          const data = JSON.parse(btn.getAttribute('data-project'));
          openModal(data);
        } catch (error) {
          console.error('JSON parsing error in data-project attribute:', error);
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
  }
});
