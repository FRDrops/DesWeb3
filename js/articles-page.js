/**
 * Logika Katalog Artikel (artikel.html):
 * - Pencarian teks & filter kategori/kebutuhan
 * - Sistem rekomendasi & pengurutan otomatis berdasarkan Path aktif
 * - Tombol kategori otomatis menyesuaikan artikel pada Path aktif
 * - Catatan: seluruh kartu sudah hadir di HTML statis sehingga tetap terbaca tanpa JS.
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const searchInput = document.getElementById('article-search');
    const categoryButtons = document.querySelectorAll('[data-category-filter]');
    const pathButtons = document.querySelectorAll('[data-path-option]');
    const countLabel = document.getElementById('articles-count');
    const emptyState = document.getElementById('articles-empty');
    const pathHint = document.getElementById('catalog-path-hint');
    const resetBtn = document.getElementById('reset-article-filters');

    const cards = Array.from(
      grid.querySelectorAll('[data-article-card]')
    );

    let activeCategory = 'Semua';
    let searchQuery = '';

    function getCurrentPath() {
      return (global.SoraState && global.SoraState.getActiveTheme()) || 'all';
    }

    function updateCatalogView() {
      const currentPath = getCurrentPath();
      const query = searchQuery.trim().toLowerCase();

      if (pathHint) {
        if (currentPath === 'pink') {
          pathHint.textContent =
            'Menampilkan rekomendasi Jalur Pink terlebih dahulu, diikuti konten inti.';
        } else if (currentPath === 'blue') {
          pathHint.textContent =
            'Menampilkan rekomendasi Jalur Biru terlebih dahulu, diikuti konten inti.';
        } else {
          pathHint.textContent =
            'Menampilkan seluruh artikel (Konten Inti, Jalur Pink, dan Jalur Biru) secara setara.';
        }
      }

      categoryButtons.forEach(function (button) {
        const category = button.dataset.categoryFilter;

        const hasArticle = cards.some(function (card) {
          const cardPath = card.dataset.path || 'inti';
          const cardCategory = card.dataset.category || '';

          const matchesPath =
            currentPath === 'all' ||
            cardPath === currentPath ||
            cardPath === 'inti';

          return matchesPath && cardCategory === category;
        });

        button.hidden = category !== 'Semua' && !hasArticle;
      });

      const categoryExists = Array.from(categoryButtons).some(function (button) {
        return button.dataset.categoryFilter === activeCategory &&
          !button.hidden;
      });

      if (!categoryExists) {
        activeCategory = 'Semua';
      }

      categoryButtons.forEach(function (button) {
        button.setAttribute(
          'aria-pressed',
          button.dataset.categoryFilter === activeCategory ? 'true' : 'false'
        );
      });

      pathButtons.forEach(function (button) {
        button.setAttribute(
          'aria-pressed',
          button.dataset.pathOption === currentPath ? 'true' : 'false'
        );
      });

      const scored = cards.map(function (card, idx) {
        const cardPath = card.dataset.path || 'inti';

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
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }

        return a.idx - b.idx;
      });

      let visibleCount = 0;

      scored.forEach(function (item) {
        const card = item.card;
        const cardPath = card.dataset.path || 'inti';
        const category = card.dataset.category || '';

        const text = (
          card.getAttribute('data-search') ||
          card.textContent ||
          ''
        ).toLowerCase();

        const matchesPath =
          currentPath === 'all' ||
          cardPath === currentPath ||
          cardPath === 'inti';

        const matchesCategory =
          activeCategory === 'Semua' ||
          category === activeCategory;

        const matchesSearch =
          !query || text.includes(query);

        const isVisible =
          matchesPath && matchesCategory && matchesSearch;

        card.hidden = !isVisible;
        card.classList.toggle('is-recommended', item.isRec);

        const recBadge = card.querySelector('[data-rec-badge]');

        if (recBadge) {
          recBadge.hidden = !item.isRec;
        }

        if (isVisible) {
          visibleCount++;
        }

        grid.appendChild(card);
      });

      if (countLabel) {
        countLabel.textContent =
          'Menampilkan ' + visibleCount + ' dari ' + cards.length + ' artikel';
      }

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    categoryButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.dataset.categoryFilter || 'Semua';
        updateCatalogView();
      });
    });

    pathButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const selectedPath = button.dataset.pathOption;

        if (global.SoraState &&
            typeof global.SoraState.setActiveTheme === 'function') {
          global.SoraState.setActiveTheme(selectedPath);
        }

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

        if (searchInput) {
          searchInput.value = '';
        }

        updateCatalogView();
      });
    }

    global.addEventListener('sora:themechange', updateCatalogView);

    updateCatalogView();
  });

})(window);
