/**
 * Konfigurasi Global SORA: Jalur (Path), Aset Maskot Resmi, dan URL Keluar Cepat
 */
(function (global) {
  'use strict';

  const QUICK_EXIT_URL = 'https://www.google.com';

  const PATH_OPTIONS = [
    {
      id: 'all',
      label: 'Semua Topik',
      shortLabel: 'Semua',
      description: 'Akses setara ke semua topik kesehatan remaja tanpa memilih jalur khusus.',
      mascotSrc: 'public/assets/mascot/sora-mascot-neutral.png',
      mascotAlt: 'Maskot SORA netral berwarna biru muda bermahkota bintang sedang memegang buku catatan.',
    },
    {
      id: 'pink',
      label: 'Perubahan Tubuh: Haid & Pubertas Perempuan',
      shortLabel: 'Jalur Pink',
      description: 'Fokus seputar menstruasi, perawatan area kewanitaan, anemia, dan perubahan tubuh remaja perempuan.',
      mascotSrc: 'public/assets/mascot/sora-mascot-pink.png',
      mascotAlt: 'Maskot SORA pink dengan hiasan bunga di kepala sedang tersenyum ramah.',
    },
    {
      id: 'blue',
      label: 'Perubahan Tubuh: Suara, Mimpi Basah & Pubertas Laki-Laki',
      shortLabel: 'Jalur Biru',
      description: 'Fokus seputar pubertas remaja laki-laki, kebersihan organ reproduksi, kesehatan mental, dan olahraga aman.',
      mascotSrc: 'public/assets/mascot/sora-mascot-blue.png',
      mascotAlt: 'Maskot SORA biru memakai topi bisbol dan memegang perisai biru muda.',
    },
  ];

  global.SoraConfig = {
    QUICK_EXIT_URL,
    PATH_OPTIONS,
  };
})(window);
