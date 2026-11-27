/**
 * Logika Health Check Mini + Result Dashboard (PRD F2)
 * - Energi Maskot (0-100): Tidur (60 poin) + Air (40 poin)
 * - Mood (5 emoji) TIDAK masuk skor; hanya menentukan nada pesan & deteksi 3 hari berturut-turut
 * - Riwayat 7 hari terakhir disimpan lokal di localStorage
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('hc-form');
    if (!form) return;

    const stateApi = global.SoraState;
    const configApi = global.SoraConfig;

    const sleepInput = document.getElementById('hc-sleep');
    const sleepValEl = document.getElementById('hc-sleep-val');
    const waterInput = document.getElementById('hc-water');
    const waterValEl = document.getElementById('hc-water-val');
    const moodButtons = document.querySelectorAll('[data-mood-value]');

    const mascotFrame = document.getElementById('hc-mascot-frame');
    const mascotImg = document.getElementById('hc-mascot-img');
    const statusBadge = document.getElementById('hc-status-badge');
    const scoreEl = document.getElementById('hc-score');
    const breakdownEl = document.getElementById('hc-breakdown');
    const tipEl = document.getElementById('hc-tip');
    const lowSleepAction = document.getElementById('hc-low-actions');
    const moodAlertBox = document.getElementById('hc-mood-alert');
    const historyStrip = document.getElementById('hc-history-strip');
    const saveFeedbackEl = document.getElementById('hc-save-feedback');

    let selectedMood = 3;

    function getTodayISO() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }

    /**
     * Hitung poin tidur (maks. 60 poin).
     * Target remaja (WHO/IDAI): 8-10 jam mendapat poin penuh 60.
     * Tidur terlalu sedikit maupun terlalu banyak tetap diberi pendekatan lembut.
     */
    function computeSleepPoints(hours) {
      if (hours >= 8 && hours <= 10) return 60;
      if (hours === 7 || hours === 11) return 48;
      if (hours === 6 || hours === 12) return 36;
      if (hours <= 0) return 0;
      return Math.max(0, Math.round((hours / 8) * 60));
    }

    /**
     * Hitung poin air (maks. 40 poin).
     * 8 gelas dipakai sebagai patokan umum, bukan angka wajib.
     */
    function computeWaterPoints(glasses) {
      return Math.min(40, Math.max(0, Math.round((glasses / 8) * 40)));
    }

    function buildGentleTip(sleepHours, waterGlasses, moodLevel, totalScore) {
      const parts = [];

      if (sleepHours < 7) {
        parts.push('Tidurmu semalam agak singkat—coba beri jeda layar 20 menit lebih awal malam ini ya.');
      } else if (sleepHours > 10) {
        parts.push('Tidur lebih dari 10 jam kadang bikin badan masih terasa berat; peregangan ringan di pagi hari bisa bantu menyegarkan.');
      } else {
        parts.push('Jam tidurmu sudah berada di rentang yang baik untuk pemulihan tubuh remaja.');
      }

      if (waterGlasses < 6) {
        parts.push('Minum airnya bisa ditambah pelan-pelan hari ini agar fokus tetap terjaga.');
      }

      if (moodLevel <= 2) {
        parts.unshift('Hari ini terasa berat ya. Tidak apa-apa kalau energimu belum penuh—ambil napas pelan dan beri ruang untuk istirahat.');
      } else if (totalScore >= 80 && moodLevel >= 4) {
        parts.push('Pertahankan ritme kebiasaan baik ini!');
      }

      return parts.join(' ');
    }

    function updateActiveMascotVisual() {
      if (!mascotImg || !stateApi || !configApi) return;
      const theme = stateApi.getActiveTheme();
      const pathObj =
        configApi.PATH_OPTIONS.find(function (p) {
          return p.id === theme;
        }) || configApi.PATH_OPTIONS[0];
      mascotImg.src = pathObj.mascotSrc;
      mascotImg.alt = pathObj.mascotAlt;
    }

    function renderDashboard(sleepHours, waterGlasses, moodLevel) {
      const sleepPts = computeSleepPoints(sleepHours);
      const waterPts = computeWaterPoints(waterGlasses);
      const totalScore = sleepPts + waterPts;

      let levelClass = 'is-high';
      let badgeText = 'Maskot Ceria (80–100)';
      if (totalScore < 50) {
        levelClass = 'is-low';
        badgeText = 'Maskot Lesu (< 50)';
      } else if (totalScore < 80) {
        levelClass = 'is-mid';
        badgeText = 'Maskot Lumayan (50–79)';
      }

      if (mascotFrame) {
        mascotFrame.className = 'mascot-status-frame ' + levelClass;
      }
      if (statusBadge) {
        statusBadge.className = 'status-badge ' + levelClass;
        statusBadge.textContent = badgeText;
      }
      if (scoreEl) {
        scoreEl.textContent = totalScore + ' / 100';
      }
      if (breakdownEl) {
        breakdownEl.textContent =
          'Tidur: ' + sleepPts + '/60 poin · Air: ' + waterPts + '/40 poin · Mood tidak memengaruhi angka skor';
      }
      if (tipEl) {
        tipEl.textContent = buildGentleTip(sleepHours, waterGlasses, moodLevel, totalScore);
      }
      if (lowSleepAction) {
        lowSleepAction.hidden = totalScore >= 50;
      }

      updateActiveMascotVisual();
      return { sleepPts, waterPts, totalScore };
    }

    function renderHistoryStrip() {
      if (!historyStrip || !stateApi) return;
      const state = stateApi.readUserState();
      const history = state.healthCheckHistory || [];

      // Cek 3 hari berturut-turut dengan mood level 1-2 (PRD F2)
      let showConsecutiveLowMood = false;
      if (history.length >= 3) {
        const last3 = history.slice(-3);
        showConsecutiveLowMood = last3.every(function (entry) {
          return Number(entry.mood) <= 2;
        });
      }
      if (moodAlertBox) {
        moodAlertBox.hidden = !showConsecutiveLowMood;
      }

      // Render 7 kotak ringkasan terakhir
      const slots = [];
      for (let i = 0; i < 7; i += 1) {
        const item = history[i];
        if (item) {
          const shortDate = item.date ? item.date.slice(5) : 'H-' + (i + 1);
          slots.push(
            '<div class="hc-day-tile has-data" title="Tanggal ' +
              item.date +
              ': Energi ' +
              item.score +
              '/100">' +
              '<span>' +
              shortDate +
              '</span>' +
              '<span class="hc-day-score">' +
              item.score +
              '</span>' +
              '</div>'
          );
        } else {
          slots.push(
            '<div class="hc-day-tile">' +
              '<span>Hari ' +
              (i + 1) +
              '</span>' +
              '<span class="hc-day-score">—</span>' +
              '</div>'
          );
        }
      }
      historyStrip.innerHTML = slots.join('');
    }

    function syncInputsPreview() {
      const sleepHours = Number(sleepInput.value);
      const waterGlasses = Number(waterInput.value);
      if (sleepValEl) sleepValEl.textContent = sleepHours + ' jam';
      if (waterValEl) waterValEl.textContent = waterGlasses + ' gelas';
      renderDashboard(sleepHours, waterGlasses, selectedMood);
    }

    moodButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedMood = Number(btn.getAttribute('data-mood-value')) || 3;
        moodButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        syncInputsPreview();
      });
    });

    sleepInput.addEventListener('input', syncInputsPreview);
    waterInput.addEventListener('input', syncInputsPreview);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const sleepHours = Number(sleepInput.value);
      const waterGlasses = Number(waterInput.value);
      const result = renderDashboard(sleepHours, waterGlasses, selectedMood);

      if (stateApi) {
        const state = stateApi.readUserState();
        const today = getTodayISO();
        const nextEntry = {
          date: today,
          sleep: sleepHours,
          water: waterGlasses,
          mood: selectedMood,
          score: result.totalScore,
        };

        const filtered = state.healthCheckHistory.filter(function (entry) {
          return entry.date !== today;
        });
        filtered.push(nextEntry);
        state.healthCheckHistory = filtered.slice(-7);
        stateApi.writeUserState(state);
      }

      renderHistoryStrip();
      if (saveFeedbackEl) {
        saveFeedbackEl.textContent = 'Catatan kebiasaan hari ini tersimpan secara lokal di perangkatmu.';
      }
    });

    window.addEventListener('sora:themechange', updateActiveMascotVisual);
    window.addEventListener('sora:dataclear', function () {
      renderHistoryStrip();
      if (saveFeedbackEl) saveFeedbackEl.textContent = '';
    });

    // Inisialisasi awal dari entri terakhir jika ada
    if (stateApi) {
      const initialState = stateApi.readUserState();
      if (initialState.healthCheckHistory.length > 0) {
        const latest = initialState.healthCheckHistory[initialState.healthCheckHistory.length - 1];
        sleepInput.value = latest.sleep;
        waterInput.value = latest.water;
        selectedMood = Number(latest.mood) || 3;
        moodButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', Number(b.getAttribute('data-mood-value')) === selectedMood ? 'true' : 'false');
        });
      }
    }

    syncInputsPreview();
    renderHistoryStrip();
  });
})(window);
