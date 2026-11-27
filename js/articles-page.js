/**
 * Logika Katalog Artikel (artikel.html):
 * - Pencarian teks & filter kategori/kebutuhan
 * - Sistem rekomendasi & pengurutan otomatis berdasarkan Path aktif
 * - Catatan: seluruh kartu sudah hadir di HTML statis sehingga tetap terbaca tanpa JS.
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const searchInput = document.getElementById('article-search');
    const filterButtons = document.querySelectorAll('[data-category-filter]');
    const countLabel = document.getElementById('articles-count');
    const emptyState = document.getElementById('articles-empty');
    const pathHint = document.getElementById('catalog-path-hint');
    const resetBtn = document.getElementById('reset-article-filters');

    const cards = Array.prototype.slice.call(grid.querySelectorAll('[data-article-card]'));
    let activeCategory = 'Semua';
    let searchQuery = '';

    function getCurrentPath() {
      return (global.SoraState && global.SoraState.getActiveTheme()) || 'all';
    }

    function updateCatalogView() {
      const currentPath = getCurrentPath();
      const query = searchQuery.trim().toLowerCase();

      // Update petunjuk rekomendasi jalur
      if (pathHint) {
        if (currentPath === 'pink') {
          pathHint.textContent = 'Menampilkan rekomendasi Jalur Pink terlebih dahulu, diikuti konten inti & jalur lain.';
        } else if (currentPath === 'blue') {
          pathHint.textContent = 'Menampilkan rekomendasi Jalur Biru terlebih dahulu, diikuti konten inti & jalur lain.';
        } else {
          pathHint.textContent = 'Menampilkan seluruh artikel (Konten Inti, Jalur Pink, dan Jalur Biru) secara setara.';
        }
      }

      // Urutkan kartu sesuai Path rekomendasi (tetap menjaga urutan relatif)
      const scored = cards.map(function (card, idx) {
        const cardPath = card.getAttribute('data-path') || 'inti';
        let priority = 2;
        let isRec = false;
        if (currentPath === 'pink') {
          if (cardPath === 'pink') {
            priority = 0;
            isRec = true;
          } else if (cardPath === 'inti') {
            priority = 1;
          }
        } else if (currentPath === 'blue') {
          if (cardPath === 'blue') {
            priority = 0;
            isRec = true;
          } else if (cardPath === 'inti') {
            priority = 1;
          }
        } else {
          priority = cardPath === 'inti' ? 0 : 1;
        }
        return { card, priority, idx, isRec };
      });

      scored.sort(function (a, b) {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.idx - b.idx;
      });

      let visibleCount = 0;
      scored.forEach(function (item) {
        const card = item.card;
        const cat = card.getAttribute('data-category') || '';
        const text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();

        const matchesCategory = activeCategory === 'Semua' || cat === activeCategory;
        const matchesSearch = !query || text.indexOf(query) !== -1;
        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;
        card.classList.toggle('is-recommended', item.isRec);

        const recBadge = card.querySelector('[data-rec-badge]');
        if (recBadge) {
          recBadge.hidden = !item.isRec;
        }

        if (isVisible) visibleCount += 1;
        grid.appendChild(card);
      });

      if (countLabel) {
        countLabel.textContent = 'Menampilkan ' + visibleCount + ' dari ' + cards.length + ' artikel';
      }

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.getAttribute('data-category-filter') || 'Semua';
        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        updateCatalogView();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value || '';
        updateCatalogView();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeCategory = 'Semua';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-category-filter') === 'Semua' ? 'true' : 'false');
        });
        updateCatalogView();
      });
    }

    window.addEventListener('sora:themechange', updateCatalogView);
    updateCatalogView();
  });
})(window);
