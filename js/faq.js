// faq.js – simple accordion toggle
document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(function (item) {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', function () {
      item.classList.toggle('active');
    });
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });
});
