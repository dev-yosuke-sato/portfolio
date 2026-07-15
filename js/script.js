document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // Smooth scroll implementation
  // -------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      // "#"だけならトップへ
      if (targetId === '#') {
        e.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        return;
      }

      // "#about"などIDが存在する場合だけ
      if (targetId.startsWith('#') && targetId.length > 1) {
        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();

          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth',
          });
        }
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

  // データをJS側でオブジェクトとして管理（保守性の向上）
  const projectData = {
    work1: {
      title: '文京千石おとなこども矯正歯科',
      tags: ['WordPress', 'Dental Clinic'],
      image: '../images/sengoku.webp',
      description: `
      <p>
        文京区にある矯正歯科クリニックの新規Webサイト制作を担当しました。
      </p>

      <p>
        「清潔感」と「親しみやすさ」をテーマにデザインを設計し、
        WordPressオリジナルテーマをベースに独自カスタマイズを実施しています。
      </p>

      <ul class="space-y-2 mt-6">
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          WordPress（オリジナルテーマ）構築
        </li>
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          スマホ予約導線の最適化
        </li>
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          更新しやすいCMSを構築
        </li>
      </ul>
    `,
      link: 'https://sengoku-kyousei.com/',
    },

    work2: {
      title: '株式会社EXISM',
      tags: ['WordPress', 'Corporate'],
      image: '../images/exism.png',
      description: `
      <p>
        株式会社EXISMのコーポレートサイト制作を担当しました。
      </p>

      <p>
        信頼感と専門性を伝えられるデザインを意識し、
        WordPressによるCMS化を実施。
      </p>

      <ul class="space-y-2 mt-6">
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          WordPressサイト制作
        </li>
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          レスポンシブ対応
        </li>
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
          SEO・表示速度最適化
        </li>
      </ul>
    `,
      link: 'https://www.exism.co.jp/',
    },
  };
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

    // data-project-id属性を持つボタンにイベントをバインド
    document.querySelectorAll('[data-project-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project-id');
        const data = projectData[projectId];

        if (data) {
          openModal(data);
        } else {
          console.error(
            '指定されたプロジェクトデータが見つかりません: ',
            projectId,
          );
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
  }
});

// -------------------------------------------------------------
// Mobile Menu Logic (Full-screen White Background)
// -------------------------------------------------------------
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu'); // 新しいHTMLのIDに合わせる
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuToggle && mobileMenu && mobileMenuIcon) {
  const toggleMenu = () => {
    const isOpen = !mobileMenu.classList.contains('hidden');

    if (isOpen) {
      // 閉じるアニメーション
      mobileMenu.classList.remove('opacity-100');
      mobileMenu.classList.add('opacity-0');
      mobileMenuIcon.textContent = 'menu'; // アイコンを三本線に戻す

      // アニメーション完了後にDOMを非表示にする
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        document.body.style.overflow = ''; // スクロールロック解除
      }, 300);
    } else {
      // 開く処理
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');

      requestAnimationFrame(() => {
        mobileMenu.classList.remove('opacity-0');
        mobileMenu.classList.add('opacity-100');
      });

      mobileMenuIcon.textContent = 'close'; // アイコンを×に変更
      document.body.style.overflow = 'hidden'; // スクロールロック
    }
  };

  // トグルボタンでの開閉
  mobileMenuToggle.addEventListener('click', toggleMenu);

  // リンククリック時もメニューを閉じる
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  });
}
