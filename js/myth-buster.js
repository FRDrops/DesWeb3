/**
 * Logika Myth Buster Challenge (PRD F3):
 * - Urutan acak dengan prioritas kartu jalur aktif (kartu inti selalu tampil)
 * - Ketuk/klik atau Enter/Space membalik kartu (fade otomatis pada prefers-reduced-motion)
 * - Penghitung progres "Kamu sudah membongkar X/20 mitos" disimpan lokal
 * - Sisi belakang tetap terbaca screen reader tanpa wajib membalik visual
 * - Tombol "Laporkan kartu ini keliru" membuka Modal aksesibel
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('myth-grid');
    if (!grid || !global.SoraMyths || !global.SoraState) return;

    const stateApi = global.SoraState;
    const cardsData = global.SoraMyths.MYTH_CARDS.slice();
    const filterButtons = document.querySelectorAll('[data-myth-filter]');
    const progressText = document.getElementById('myth-progress-text');
    const progressFill = document.getElementById('myth-progress-fill');
    const resetBtn = document.getElementById('myth-reset-progress');

    let activeCategory = 'Semua';

    // Acak Fisher-Yates ringan per sesi
    function shuffleArray(arr) {
      const copy = arr.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    }

    const sessionShuffled = shuffleArray(cardsData);

    function updateProgressBar() {
      const state = stateApi.readUserState();
      const count = state.mythBustedIds.length;
      const total = cardsData.length;
      if (progressText) {
        progressText.textContent = 'Kamu sudah membongkar ' + count + '/' + total + ' mitos';
      }
      if (progressFill) {
        const pct = Math.round((count / total) * 100);
        progressFill.style.width = pct + '%';
      }
    }

    function markBusted(mythId) {
      const state = stateApi.readUserState();
      if (state.mythBustedIds.indexOf(mythId) === -1) {
        state.mythBustedIds.push(mythId);
        stateApi.writeUserState(state);
        updateProgressBar();
      }
    }

    function getOrderedCards() {
      const currentPath = stateApi.getActiveTheme();
      const filtered = sessionShuffled.filter(function (item) {
        return activeCategory === 'Semua' || item.category === activeCategory;
      });

      // Prioritaskan kartu jalur aktif di bagian atas, lalu inti, lalu jalur lainnya
      return filtered.slice().sort(function (a, b) {
        function getRank(card) {
          if (currentPath === 'pink') {
            if (card.path === 'pink') return 0;
            if (card.path === 'inti') return 1;
            return 2;
          }
          if (currentPath === 'blue') {
            if (card.path === 'blue') return 0;
            if (card.path === 'inti') return 1;
            return 2;
          }
          return card.path === 'inti' ? 0 : 1;
        }
        return getRank(a) - getRank(b);
      });
    }

    function renderGrid() {
      const ordered = getOrderedCards();
      const bustedIds = stateApi.readUserState().mythBustedIds;

      grid.innerHTML = ordered
        .map(function (item) {
          const isBusted = bustedIds.indexOf(item.id) !== -1;
          const pathLabel =
            item.path === 'pink' ? 'Jalur Pink' : item.path === 'blue' ? 'Jalur Biru' : 'Konten Inti';
          const badgeClass =
            item.path === 'pink'
              ? 'badge-path-pink'
              : item.path === 'blue'
              ? 'badge-path-blue'
              : 'badge-path-inti';

          return (
            '<div class="myth-card-wrap">' +
            '<article class="myth-card ' +
            (isBusted ? 'is-flipped' : '') +
            '" data-myth-card="' +
            item.id +
            '">' +
            '<div class="myth-face myth-face-front" tabindex="0" role="button" aria-pressed="' +
            (isBusted ? 'true' : 'false') +
            '" aria-label="Kartu mitos: ' +
            item.myth +
            '. Tekan Enter atau Spasi untuk melihat fakta.">' +
            '<div>' +
            '<div class="article-card-meta">' +
            '<span class="badge ' +
            badgeClass +
            '">' +
            pathLabel +
            '</span>' +
            '<span class="badge badge-cat">' +
            item.category +
            '</span>' +
            '</div>' +
            '<p class="myth-statement">“' +
            item.myth +
            '”</p>' +
            '</div>' +
            '<div class="article-card-footer">' +
            '<span>' +
            (isBusted ? 'Sudah terbongkar ✓' : 'Ketuk atau tekan Enter untuk balik') +
            '</span>' +
            '<span style="font-weight:700;color:var(--accent-text);">Lihat Fakta &rarr;</span>' +
            '</div>' +
            '</div>' +
            // Sisi belakang tetap dapat dibaca screen reader tanpa harus membalik visual (PRD F3)
            '<div class="myth-face myth-face-back">' +
            '<div>' +
            '<span class="editorial-kicker">Fakta</span>' +
            '<p class="myth-fact-text">' +
            item.fact +
            '</p>' +
            '<p class="myth-source-meta"><strong>Sumber:</strong> ' +
            item.source +
            '<br /><strong>Tinjau:</strong> ' +
            item.reviewDate +
            '</p>' +
            '</div>' +
            '<div class="myth-back-actions">' +
            '<button type="button" class="btn btn-secondary btn-compact" data-flip-back="' +
            item.id +
            '">Balik ke Mitos</button>' +
            '<button type="button" class="myth-report-link" data-report-myth="' +
            item.id +
            '">Laporkan kartu ini keliru</button>' +
            '</div>' +
            '</div>' +
            '</article>' +
            '</div>'
          );
        })
        .join('');

      attachCardEvents();
      updateProgressBar();
    }

    function toggleCard(cardId, forceFlip) {
      const cardEl = grid.querySelector('[data-myth-card="' + cardId + '"]');
      if (!cardEl) return;
      const nextFlip = typeof forceFlip === 'boolean' ? forceFlip : !cardEl.classList.contains('is-flipped');
      cardEl.classList.toggle('is-flipped', nextFlip);
      const frontEl = cardEl.querySelector('.myth-face-front');
      if (frontEl) {
        frontEl.setAttribute('aria-pressed', nextFlip ? 'true' : 'false');
      }
      if (nextFlip) {
        markBusted(cardId);
      }
    }

    function attachCardEvents() {
      grid.querySelectorAll('.myth-face-front').forEach(function (frontEl) {
        const cardEl = frontEl.closest('[data-myth-card]');
        const id = cardEl ? cardEl.getAttribute('data-myth-card') : '';
        frontEl.addEventListener('click', function () {
          toggleCard(id, true);
        });
        frontEl.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard(id, true);
          }
        });
      });

      grid.querySelectorAll('[data-flip-back]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-flip-back');
          toggleCard(id, false);
        });
      });

      grid.querySelectorAll('[data-report-myth]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-report-myth');
          if (global.SoraUI) {
            global.SoraUI.openModal({
              title: 'Laporkan Kartu Keliru',
              message:
                'Terima kasih sudah peduli pada keakuratan informasi SORA. Laporan untuk kartu (' +
                id +
                ') dicatat untuk ditinjau ulang oleh tim konten (target koreksi maksimal 7 hari sesuai PRD).',
              confirmLabel: 'Kirim Laporan (Simulasi)',
              cancelLabel: 'Batal',
              includeHelpLink: true,
              onConfirm: function () {
                global.SoraUI.openModal({
                  title: 'Laporan Diterima',
                  message:
                    'Catatan perbaikanmu telah disimpan dalam mode pratinjau lokal. Saat terhubung ke endpoint tim, laporan ini diteruskan ke moderator konten.',
                  confirmLabel: 'Mengerti',
                  includeHelpLink: false,
                });
              },
            });
          }
        });
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.getAttribute('data-myth-filter') || 'Semua';
        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        renderGrid();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        const state = stateApi.readUserState();
        state.mythBustedIds = [];
        stateApi.writeUserState(state);
        renderGrid();
      });
    }

    window.addEventListener('sora:themechange', renderGrid);
    window.addEventListener('sora:dataclear', renderGrid);

    renderGrid();
  });
})(window);
