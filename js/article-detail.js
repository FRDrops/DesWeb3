/**
 * Logika Halaman Detail Artikel Hybrid:
 * - Pengalih kedalaman SMP / SMA (tanpa mengumpulkan data usia)
 * - Umpan balik "Apakah artikel ini membantu?" (disimpan lokal agar konsisten)
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Pengalih Tingkat SMP / SMA
    const depthContainers = document.querySelectorAll('[data-depth-switcher]');
    depthContainers.forEach(function (container) {
      const buttons = container.querySelectorAll('[data-depth-target]');
      const panels = container.querySelectorAll('[data-depth-panel]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const target = btn.getAttribute('data-depth-target');
          buttons.forEach(function (b) {
            b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          });
          panels.forEach(function (panel) {
            const isMatch = panel.getAttribute('data-depth-panel') === target;
            panel.hidden = !isMatch;
            if (isMatch && panel.tagName === 'DETAILS') {
              panel.open = true;
            }
          });
        });
      });
    });

    // 2. Umpan Balik Artikel (Membantu? Ya / Kurang)
    const feedbackBox = document.querySelector('[data-article-feedback]');
    if (feedbackBox) {
      const slug = feedbackBox.getAttribute('data-article-slug') || 'artikel';
      const statusEl = feedbackBox.querySelector('[data-feedback-status]');
      const voteButtons = feedbackBox.querySelectorAll('[data-vote]');
      const storageKey = 'sora_article_votes';

      function readVotes() {
        try {
          return JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch {
          return {};
        }
      }

      function renderVote(vote) {
        voteButtons.forEach(function (btn) {
          const isMatch = btn.getAttribute('data-vote') === vote;
          btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });
        if (statusEl) {
          if (vote === 'up') {
            statusEl.textContent = 'Terima kasih! Senang artikel ini membantu.';
          } else if (vote === 'down') {
            statusEl.textContent = 'Terima kasih atas masukanmu. Kamu juga bisa kirim pertanyaan lewat Tanya Anonim.';
          } else {
            statusEl.textContent = '';
          }
        }
      }

      const saved = readVotes();
      if (saved[slug]) {
        renderVote(saved[slug]);
      }

      voteButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const vote = btn.getAttribute('data-vote');
          const votes = readVotes();
          votes[slug] = vote;
          try {
            localStorage.setItem(storageKey, JSON.stringify(votes));
          } catch {}
          renderVote(vote);
        });
      });
    }
  });
})(window);
