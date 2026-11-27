/**
 * Manajemen State Lokal SORA (Guest Mode / localStorage)
 * Menyimpan seminimal mungkin data non-identitas sesuai PRD Bag. 11.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'sora_user_state';
  const VALID_PATHS = ['all', 'pink', 'blue'];

  const DEFAULT_STATE = {
    path: null, // null menandakan pengunjung belum memilih jalur (onboarding)
    healthCheckHistory: [], // maks. 7 hari terakhir (PRD F2)
    mythBustedIds: [], // daftar ID kartu mitos yang sudah dibalik (PRD F3)
  };

  function readUserState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        path: VALID_PATHS.includes(parsed.path) ? parsed.path : null,
        healthCheckHistory: Array.isArray(parsed.healthCheckHistory)
          ? parsed.healthCheckHistory.slice(-7)
          : [],
        mythBustedIds: Array.isArray(parsed.mythBustedIds) ? parsed.mythBustedIds : [],
      };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function writeUserState(nextState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Abaikan jika storage diblokir browser
    }
  }

  function getActiveTheme() {
    const state = readUserState();
    return state.path || 'all';
  }

  function setActivePath(pathId) {
    const normalized = VALID_PATHS.includes(pathId) ? pathId : 'all';
    const state = readUserState();
    state.path = normalized;
    writeUserState(state);

    document.documentElement.dataset.theme = normalized;
    window.dispatchEvent(new CustomEvent('sora:themechange', { detail: { path: normalized } }));
    return normalized;
  }

  function clearAllUserData() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem('sora_article_votes');
    } catch {
      // Abaikan jika storage tidak dapat diakses
    }
    document.documentElement.dataset.theme = 'all';
    window.dispatchEvent(new CustomEvent('sora:themechange', { detail: { path: 'all', cleared: true } }));
    window.dispatchEvent(new CustomEvent('sora:dataclear'));
  }

  function triggerQuickExit(targetUrl) {
    const fallback = (global.SoraConfig && global.SoraConfig.QUICK_EXIT_URL) || 'https://www.google.com';
    window.location.replace(targetUrl || fallback);
  }

  global.SoraState = {
    STORAGE_KEY,
    VALID_PATHS,
    readUserState,
    writeUserState,
    getActiveTheme,
    setActivePath,
    clearAllUserData,
    triggerQuickExit,
  };
})(window);
