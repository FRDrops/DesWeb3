// health-check.js – renders questionnaire, tracks answers, shows result
(function () {
  const container = document.getElementById('question-section');
  const resultSection = document.getElementById('result-section');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressBar = document.querySelector('.health-progress .filled');
  const nav = document.querySelector('.health-nav');

  let currentIndex = 0;
  const answers = [];
  const questions = window.healthQuestions || [];

  function renderQuestion() {
    const q = questions[currentIndex];
    if (!q) return;
    const html = `
      <div class="health-question" data-id="${q.id}">
        <h3>${q.title}</h3>
        <ul class="health-options">
          ${q.options
            .map(
              (opt, i) => `
            <li>
              <label>
                <input type="radio" name="q${q.id}" value="${opt.value}" ${answers[currentIndex] === opt.value ? 'checked' : ''} />
                ${opt.label}
              </label>
            </li>`
            )
            .join('')}
        </ul>
      </div>`;
    container.innerHTML = html;
    updateNav();
    updateProgress();
  }

  function updateNav() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Selesai' : 'Berikutnya';
    nav.hidden = false;
  }

  function updateProgress() {
    const percent = ((currentIndex) / questions.length) * 100;
    progressBar.style.width = percent + '%';
  }

  function collectAnswer() {
    const inputs = document.querySelectorAll(`input[name='q${questions[currentIndex].id}']`);
    inputs.forEach(inp => {
      if (inp.checked) {
        answers[currentIndex] = Number(inp.value);
      }
    });
  }

  function showResult() {
    const total = answers.reduce((sum, v) => sum + (v ?? 0), 0);
    // Simple categorisation
    let level = 'Rendah';
    if (total >= 7) level = 'Tinggi';
    else if (total >= 4) level = 'Sedang';
    resultSection.innerHTML = `<h2>Hasil Health Check</h2><p>Skor total: ${total}</p><p>Tingkat risiko: <strong>${level}</strong></p>`;
    resultSection.hidden = false;
    container.hidden = true;
    nav.hidden = true;
    progressBar.style.width = '100%';
  }

  prevBtn.addEventListener('click', function () {
    collectAnswer();
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', function () {
    collectAnswer();
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      // final step
      if (answers.length < questions.length) {
        alert('Silakan jawab semua pertanyaan');
        return;
      }
      showResult();
    }
  });

  // initialise
  if (questions.length) {
    renderQuestion();
  } else {
    container.innerHTML = '<p>Data pertanyaan tidak tersedia.</p>';
  }
})();
