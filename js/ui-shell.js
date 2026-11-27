/**
 * Pengendali UI Global SORA:
 * - Sinkronisasi tombol Path Switcher (Desktop & Mobile)
 * - Drawer Hamburger Smartphone
 * - Tombol Keluar Cepat
 * - Sistem Modal Aksesibel (focus trap, Esc, tautan Butuh Bantuan?)
 * - Konfirmasi "Hapus data saya"
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const stateApi = global.SoraState;
    if (!stateApi) return;

    // 1. Sinkronisasi Path Switcher
    function syncPathButtons(activeTheme) {
      document.querySelectorAll('[data-path-option]').forEach(function (btn) {
        const isMatch = btn.getAttribute('data-path-option') === activeTheme;
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
    }

    syncPathButtons(stateApi.getActiveTheme());

    window.addEventListener('sora:themechange', function (event) {
      const nextPath = (event.detail && event.detail.path) || stateApi.getActiveTheme();
      syncPathButtons(nextPath);
    });

    document.querySelectorAll('[data-path-option]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const chosen = btn.getAttribute('data-path-option');
        if (chosen) {
          stateApi.setActivePath(chosen);
        }
      });
    });

    // 2. Hamburger Drawer Smartphone
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');

    function setDrawerOpen(open) {
      if (!menuToggle || !mobileDrawer) return;
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
      mobileDrawer.hidden = !open;
    }

    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', function () {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        setDrawerOpen(!isOpen);
      });

      mobileDrawer.querySelectorAll('a, button').forEach(function (el) {
        el.addEventListener('click', function () {
          setDrawerOpen(false);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          setDrawerOpen(false);
          menuToggle.focus();
        }
      });
    }

    // 3. Keluar Cepat
    document.querySelectorAll('[data-quick-exit]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        stateApi.triggerQuickExit(link.getAttribute('data-quick-exit'));
      });
    });

    // 4. Sistem Modal Aksesibel
    const basePath = (document.documentElement.dataset.base || '.').replace(/\/$/, '');
    const modalBackdrop = document.getElementById('sora-modal');
    const modalPanel = modalBackdrop ? modalBackdrop.querySelector('.modal-panel') : null;
    const modalTitle = document.getElementById('sora-modal-title');
    const modalBody = document.getElementById('sora-modal-desc');
    const modalHelp = document.getElementById('sora-modal-help');
    const modalHelpLink = modalHelp ? modalHelp.querySelector('a') : null;
    const modalConfirm = modalBackdrop ? modalBackdrop.querySelector('[data-modal-confirm]') : null;
    const modalCancel = modalBackdrop ? modalBackdrop.querySelector('[data-modal-cancel]') : null;

    let lastFocused = null;
    let activeConfirmHandler = null;

    function getFocusable(container) {
      return Array.prototype.slice
        .call(
          container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        .filter(function (el) {
          return !el.hasAttribute('hidden');
        });
    }

    function closeModal() {
      if (!modalBackdrop) return;
      modalBackdrop.hidden = true;
      activeConfirmHandler = null;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    function openModal(options) {
      if (!modalBackdrop || !modalPanel || !modalTitle || !modalBody) return;
      const opts = options || {};
      lastFocused = document.activeElement;

      modalTitle.textContent = opts.title || 'Pemberitahuan';
      modalBody.textContent = opts.message || '';

      if (modalHelp) {
        modalHelp.hidden = !opts.includeHelpLink;
        if (modalHelpLink) {
          modalHelpLink.setAttribute('href', basePath + '/bantuan.html');
        }
      }
      if (modalConfirm) {
        modalConfirm.textContent = opts.confirmLabel || 'Mengerti';
      }
      if (modalCancel) {
        modalCancel.textContent = opts.cancelLabel || 'Batal';
        modalCancel.hidden = !opts.cancelLabel;
      }

      activeConfirmHandler = typeof opts.onConfirm === 'function' ? opts.onConfirm : null;
      modalBackdrop.hidden = false;
      modalPanel.focus();
    }

    if (modalBackdrop) {
      modalBackdrop.querySelectorAll('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', closeModal);
      });

      if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
      }

      if (modalConfirm) {
        modalConfirm.addEventListener('click', function () {
          const handler = activeConfirmHandler;
          closeModal();
          if (handler) handler();
        });
      }

      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) {
          closeModal();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (modalBackdrop.hidden) return;
        if (e.key === 'Escape') {
          closeModal();
          return;
        }
        if (e.key === 'Tab' && modalPanel) {
          const focusables = getFocusable(modalPanel);
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    global.SoraUI = { openModal, closeModal };

    // 5. Tombol "Hapus data saya"
    document.querySelectorAll('[data-clear-data]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal({
          title: 'Hapus data lokal di perangkat ini?',
          message:
            'Pilihan jalur, riwayat 7 hari Health Check, dan progres Myth Buster akan dihapus dari browser ini.',
          confirmLabel: 'Ya, hapus data saya',
          cancelLabel: 'Batal',
          includeHelpLink: false,
          onConfirm: function () {
            stateApi.clearAllUserData();
            openModal({
              title: 'Data berhasil dihapus',
              message:
                'Seluruh data tersimpan di browser ini telah dibersihkan dan tampilan kembali ke mode netral.',
              confirmLabel: 'Selesai',
              includeHelpLink: true,
            });
          },
        });
      });
    });

    // Tombol uji modal di Tahap 1
    const previewBtn = document.getElementById('preview-modal-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        openModal({
          title: 'Contoh Modal Konfirmasi SORA',
          message:
            'Modal ini telah mendukung fokus keyboard, tombol Esc, dan penyertaan tautan Butuh Bantuan? sesuai aturan PRD.',
          confirmLabel: 'Mengerti',
          includeHelpLink: true,
        });
      });
    }
  });
})(window);
