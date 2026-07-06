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

  // データをJS側でオブジェクトとして管理（保守性の向上）
  const projectData = {
    'project-1': {
      title: 'Corporate Site Renewal',
      tags: ['WordPress', 'Performance'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCn3C1Yr4z7AqhNFSY7gqfoheVY3AbwlmTjFg1womwfM28PmMJ5A1XxvxVa_2mMr4Wcgv21P15iN2NSeo9S1qR1zMwBCYH384RMTRhl0MhjVGwkOo5AT0lNWliG1hM2PPDsN35Dxoygb25Nb8HJQWsprt5kxcrypPVzKB5zy6RC0nKa1RH7PqkHkZDvviVCGDOsxyR4pwCCN9YRUa1IfxBdzmoRanqQpwkbiUVlQKIJ6Vi_a8fWFrr',
      description:
        '<p>16年の知見を活かし、表示速度を300%改善。管理画面の徹底的なカスタマイズで運用負荷を軽減しました。</p><ul class="space-y-2 mt-4"><li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Core Web Vitalsの最適化</li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> 独自ブロックエディタの開発</li></ul>',
      link: '#',
    },
    'project-2': {
      title: 'Service LP Production',
      tags: ['Conversion', 'Engineering'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9S1v-5gP6vLG8mkC4ZdLmqqGg5EiTacVEwf4rXTx0joTpGOsYz_ZBCxo9_0oJvNSxhLwBkHGVDW6j6U7TBfD86W8_ALHe8rxKhaBTQh13kw6wEQMkKdkuPnwPwS3Z_Jd-EvB2anPs7hfebxNp2NI7iIER7ZU4DNcbptHbeiCRqu90C8MnAKySMRagqxxkD1w9ZUKyPWF6NFu4zG_EDJ8z1RwJJERjKnAGBIrfXE22aq-JawdDFzxc',
      description:
        '<p>精密な要件分析に基づき、ユーザー動線を最適化。Next.jsを用いた高速なページ遷移でCVR向上に貢献。</p><ul class="space-y-2 mt-4"><li class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary text-sm">check_circle</span> A/Bテストに基づくUI改善</li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary text-sm">check_circle</span> 高速なページロード体験</li></ul>',
      link: '#',
    },
    'project-3': {
      title: 'Custom System Integration',
      tags: ['Complex JS', 'Logic'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA7-LzkvUhMcuKXEdR-Ze3mwPvH3ycosgCVXQGdjZ69TNHKbVdKli6CbAfsX5cfvp9AE90fNUmmi1QQDO1-CWMIMIXLdTRtsuXSGcm0alo0D5rTFjeGJVFpjIvTu1z8DhEWAGiKDUYXIveLlLdyLQxLVeOAwg6rFltua77JhZzguEsGyWSGCiXiQMCV80m9U4pq9LmYknolW3mVUUrDmrI91Kso8GzoMWuIQJSG6OLnHo_bYpOXu27F',
      description:
        '<p>複雑なビジネスロジックをフロントエンドに実装。API連携と状態管理を高度に制御し、堅牢なシステムを構築。</p><ul class="space-y-2 mt-4"><li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-sm">check_circle</span> リアルタイムデータ同期</li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-sm">check_circle</span> 拡張性の高いアーキテクチャ</li></ul>',
      link: '#',
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
