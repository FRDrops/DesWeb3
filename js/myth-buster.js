// myth-buster.js – enable flip‑card interaction
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });
    // allow keyboard activation
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
});
