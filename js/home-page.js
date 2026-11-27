/**
 * Logika Beranda Hybrid & Adaptive + Onboarding (index.html)
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const stateApi = global.SoraState;
    const configApi = global.SoraConfig;
    const articlesApi = global.SoraArticles;
    if (!stateApi || !configApi) return;

    const onboardingSection = document.getElementById('onboarding-gate');
    const heroMascotImg = document.getElementById('home-hero-mascot');
    const heroMascotCaption = document.getElementById('home-hero-mascot-caption');
    const heroKicker = document.getElementById('home-hero-kicker');
    const heroTitle = document.getElementById('home-hero-title');
    const heroLead = document.getElementById('home-hero-lead');
    const recommendedGrid = document.getElementById('home-recommended-grid');
    const hcStatEl = document.getElementById('home-hc-stat');
    const mythStatEl = document.getElementById('home-myth-stat');
    const reopenOnboardingBtn = document.getElementById('reopen-onboarding-btn');

    const HERO_COPY = {
      all: {
        kicker: 'Mode Semua Topik',
        title: 'Informasi Kesehatan Remaja yang Tenang dan Tidak Menghakimi',
        lead: 'Jelajahi topik gizi, tidur, kesehatan mental, hingga pubertas dari sumber resmi. Tanpa login dan tanpa pelacak iklan.',
        caption: 'Maskot Pemandu Netral · Semua Topik',
      },
      pink: {
        kicker: 'Jalur Pink · Haid & Pubertas Perempuan',
        title: 'Pahami Siklus Menstruasi, Tubuh, dan Keseimbangan Emosi dengan Tenang',
        lead: 'Artikel pilihan seputar haid, anemia, perawatan area kewanitaan, serta materi inti untuk kesehatan remaja sehari-hari.',
        caption: 'Maskot SORA Pink · Pendamping Jalur Pink',
      },
      blue: {
        kicker: 'Jalur Biru · Suara, Mimpi Basah & Pubertas Laki-Laki',
        title: 'Info Pubertas Santai Tanpa Gengsi dan Tanpa Ejekan',
        lead: 'Artikel pilihan seputar perubahan suara, mimpi basah, olahraga aman, serta ruang aman untuk kesehatan mental laki-laki.',
        caption: 'Maskot SORA Biru · Pendamping Jalur Biru',
      },
    };

    function syncOnboardingVisibility() {
      const state = stateApi.readUserState();
      if (onboardingSection) {
        onboardingSection.hidden = state.path !== null;
      }
    }

    function renderHeroAdaptive(activePath) {
      const pathObj =
        configApi.PATH_OPTIONS.find(function (p) {
          return p.id === activePath;
        }) || configApi.PATH_OPTIONS[0];
      const copy = HERO_COPY[pathObj.id] || HERO_COPY.all;

      if (heroMascotImg) {
        heroMascotImg.src = pathObj.mascotSrc;
        heroMascotImg.alt = pathObj.mascotAlt;
      }
      if (heroMascotCaption) heroMascotCaption.textContent = copy.caption;
      if (heroKicker) heroKicker.textContent = copy.kicker;
      if (heroTitle) heroTitle.textContent = copy.title;
      if (heroLead) heroLead.textContent = copy.lead;
    }

    function renderRecommendedArticles(activePath) {
      if (!recommendedGrid || !articlesApi) return;
      const allArticles = articlesApi.ARTICLES_DATA || [];

      let chosen = [];
      if (activePath === 'pink') {
        chosen = allArticles
          .filter(function (a) {
            return a.path === 'pink';
          })
          .slice(0, 4)
          .concat(
            allArticles
              .filter(function (a) {
                return a.path === 'inti';
              })
              .slice(0, 2)
          );
      } else if (activePath === 'blue') {
        chosen = allArticles
          .filter(function (a) {
            return a.path === 'blue';
          })
          .slice(0, 4)
          .concat(
            allArticles
              .filter(function (a) {
                return a.path === 'inti';
              })
              .slice(0, 2)
          );
      } else {
        chosen = allArticles
          .filter(function (a) {
            return a.path === 'inti';
          })
          .slice(0, 2)
          .concat(
            allArticles
              .filter(function (a) {
                return a.path === 'pink';
              })
              .slice(0, 2)
          )
          .concat(
            allArticles
              .filter(function (a) {
                return a.path === 'blue';
              })
              .slice(0, 2)
          );
      }

      recommendedGrid.innerHTML = chosen
        .map(function (art) {
          const pathLabel =
            art.path === 'pink' ? 'Jalur Pink' : art.path === 'blue' ? 'Jalur Biru' : 'Konten Inti';
          const badgeClass =
            art.path === 'pink'
              ? 'badge-path-pink'
              : art.path === 'blue'
              ? 'badge-path-blue'
              : 'badge-path-inti';
          const isRec = activePath === art.path;

          return (
            '<article class="editorial-card article-card ' +
            (isRec ? 'is-recommended' : '') +
            '">' +
            '<div class="article-card-meta">' +
            '<span class="badge ' +
            badgeClass +
            '">' +
            pathLabel +
            '</span>' +
            (isRec ? '<span class="badge badge-rec">Rekomendasi Jalurmu</span>' : '') +
            '<span class="badge badge-cat">' +
            art.category +
            '</span>' +
            '</div>' +
            '<h3 class="article-card-title"><a href="' +
            art.url +
            '">' +
            art.title +
            '</a></h3>' +
            '<p class="article-card-excerpt">' +
            art.excerpt +
            '</p>' +
            '<div class="article-card-footer"><span>' +
            art.readTime +
            '</span><a href="' +
            art.url +
            '">Baca artikel &rarr;</a></div>' +
            '</article>'
          );
        })
        .join('');
    }

    function renderFeatureStats() {
      const state = stateApi.readUserState();
      if (hcStatEl) {
        if (state.healthCheckHistory.length > 0) {
          const latest = state.healthCheckHistory[state.healthCheckHistory.length - 1];
          hcStatEl.textContent = 'Energi Maskot Terakhir: ' + latest.score + '/100';
        } else {
          hcStatEl.textContent = 'Belum diisi hari ini';
        }
      }
      if (mythStatEl) {
        mythStatEl.textContent = state.mythBustedIds.length + '/20 mitos terbongkar';
      }
    }

    // Event pilihan di Onboarding
    document.querySelectorAll('[data-onboarding-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const chosen = btn.getAttribute('data-onboarding-choice') || 'all';
        stateApi.setActivePath(chosen);
        syncOnboardingVisibility();
      });
    });

    if (reopenOnboardingBtn) {
      reopenOnboardingBtn.addEventListener('click', function () {
        if (onboardingSection) {
          onboardingSection.hidden = false;
          onboardingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    function refreshAll() {
      const activeTheme = stateApi.getActiveTheme();
      syncOnboardingVisibility();
      renderHeroAdaptive(activeTheme);
      renderRecommendedArticles(activeTheme);
      renderFeatureStats();
    }

    window.addEventListener('sora:themechange', refreshAll);
    window.addEventListener('sora:dataclear', refreshAll);

    refreshAll();
  });
})(window);
