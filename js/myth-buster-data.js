/**
 * Data 20 Kartu Myth Buster (PRD F3):
 * 8 Konten Inti + 6 Jalur Pink + 6 Jalur Biru
 * Aturan PRD: sisi mitos tidak boleh memperkuat stereotip, dan setiap fakta
 * mencantumkan sumber resmi serta tanggal tinjau.
 */
(function (global) {
  'use strict';

  const MYTH_CATEGORIES = ['Semua', 'Gizi', 'Tidur', 'Mental', 'Pubertas', 'Haid', 'Tubuh & Olahraga'];

  const MYTH_CARDS = [
    // 8 KARTU INTI
    {
      id: 'm-inti-1',
      path: 'inti',
      category: 'Gizi',
      myth: 'Semua orang wajib minum tepat 8 gelas air per hari tanpa kecuali.',
      fact: '8 gelas sehari hanyalah patokan umum yang praktis. Kebutuhan cairan tiap orang berbeda tergantung aktivitas, suhu udara, dan asupan cairan dari buah atau sup.',
      source: 'Kemenkes RI & Panduan Gizi Seimbang',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-2',
      path: 'inti',
      category: 'Tidur',
      myth: 'Kurang tidur di hari sekolah bisa dibayar lunas dengan tidur seharian di hari Minggu.',
      fact: 'Tidur lebih lama di akhir pekan memang mengurangi rasa kantuk sesaat, tetapi tetap membuat jam biologis tubuh kacau sehingga Senin pagi tetap terasa berat.',
      source: 'WHO — Adolescent Sleep & Health',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-3',
      path: 'inti',
      category: 'Mental',
      myth: 'Kalau merasa cemas atau sedih saat stres, artinya seseorang kurang kuat atau kurang bersyukur.',
      fact: 'Rasa cemas atau sedih adalah sinyal alami emosi manusia saat menghadapi tekanan. Meminta bantuan teman tepercaya, orang tua, atau profesional justru tanda keberanian.',
      source: 'WHO & Kemenkes RI (Kesehatan Jiwa Remaja)',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-4',
      path: 'inti',
      category: 'Gizi',
      myth: 'Melewatkan sarapan membuat tubuh lebih cepat sehat dan bertenaga.',
      fact: 'Melewatkan sarapan justru sering membuat gula darah turun di jam pelajaran, memicu pusing, dan sulit berkonsentrasi.',
      source: 'Kemenkes RI — Isi Piringku',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-5',
      path: 'inti',
      category: 'Tubuh & Olahraga',
      myth: 'Vape rasa buah hanyalah uap air biasa yang aman untuk paru-paru remaja.',
      fact: 'Aerosol vape umumnya mengandung nikotin yang memicu ketergantungan pada otak remaja yang masih berkembang serta zat kimia yang mengiritasi saluran napas.',
      source: 'Kemenkes RI & WHO Tobacco Fact Sheet',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-6',
      path: 'inti',
      category: 'Tidur',
      myth: 'Melihat layar ponsel sebelum tidur tidak berpengaruh asal kamar sudah gelap.',
      fact: 'Cahaya layar dan rangsangan konten di malam hari memperlambat hormon kantuk (melatonin), sehingga kualitas tidur tetap menurun meski lampu kamar dimatikan.',
      source: 'IDAI — Pola Tidur Remaja',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-7',
      path: 'inti',
      category: 'Tubuh & Olahraga',
      myth: 'Aktivitas fisik baru bermanfaat kalau berkeringat deras di tempat fitness.',
      fact: 'Jalan kaki, bersepeda santai, peregangan, dan permainan tim di sekolah juga dihitung sebagai aktivitas fisik harian yang menyehatkan jantung dan suasana hati.',
      source: 'WHO — Physical Activity Guidelines',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-inti-8',
      path: 'inti',
      category: 'Pubertas',
      myth: 'Membicarakan kesehatan reproduksi dasar dengan remaja akan memicu perilaku berisiko.',
      fact: 'Edukasi kesehatan reproduksi yang akurat justru membantu remaja memahami batas tubuh, menjaga kebersihan, dan membuat keputusan yang aman.',
      source: 'UNICEF Indonesia & Kemenkes RI',
      reviewDate: '27 November 2026',
    },

    // 6 KARTU PINK
    {
      id: 'm-pink-1',
      path: 'pink',
      category: 'Haid',
      myth: 'Minum air es saat menstruasi membuat darah haid membeku di dalam rahim.',
      fact: 'Minuman masuk ke sistem pencernaan, bukan ke rahim. Suhu minuman dingin tidak membekukan darah menstruasi.',
      source: 'IDAI & UNICEF Indonesia (MKM)',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-pink-2',
      path: 'pink',
      category: 'Haid',
      myth: 'Keramas atau mandi saat haid berbahaya dan bisa bikin darah berhenti keluar.',
      fact: 'Mandi dengan air bersih dan keramas saat haid aman dilakukan serta membantu tubuh tetap bersih dan nyaman.',
      source: 'UNICEF Indonesia — Manajemen Kebersihan Menstruasi',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-pink-3',
      path: 'pink',
      category: 'Haid',
      myth: 'Siklus haid yang belum sama persis tiap bulan di awal SMP berarti pasti ada penyakit.',
      fact: 'Pada 1–2 tahun pertama setelah menstruasi pertama, hormon masih beradaptasi sehingga jarak antar siklus wajar masih bervariasi.',
      source: 'IDAI — Menstruasi pada Remaja',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-pink-4',
      path: 'pink',
      category: 'Gizi',
      myth: 'Sering lemas dan pusing saat haid selalu cukup diatasi dengan tidur saja.',
      fact: 'Lemas berulang saat atau setelah haid bisa berkaitan dengan kurangnya zat besi (anemia). Makanan kaya zat besi dan Tablet Tambah Darah sesuai anjuran membantu mencegahnya.',
      source: 'Kemenkes RI — Pencegahan Anemia Remaja Putri',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-pink-5',
      path: 'pink',
      category: 'Pubertas',
      myth: 'Area kewanitaan harus dibersihkan memakai sabun berpewangi kuat agar bebas keputihan.',
      fact: 'Sabun berpewangi keras dapat mengganggu bakteri baik alami. Bagian luar cukup dibersihkan dengan air bersih dan dikeringkan dari depan ke belakang.',
      source: 'Kemenkes RI & IDAI',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-pink-6',
      path: 'pink',
      category: 'Mental',
      myth: 'Bentuk tubuh yang sehat selalu harus terlihat sama seperti foto populer di media sosial.',
      fact: 'Foto di media sosial sering melalui pencahayaan dan penyuntingan. Tubuh yang sehat memiliki bentuk dan ukuran yang sangat beragam secara alami.',
      source: 'UNICEF Indonesia & WHO',
      reviewDate: '27 November 2026',
    },

    // 6 KARTU BIRU
    {
      id: 'm-blue-1',
      path: 'blue',
      category: 'Pubertas',
      myth: 'Mimpi basah menandakan adanya kelainan atau gangguan kesehatan pada remaja laki-laki.',
      fact: 'Mimpi basah adalah proses fisiologis normal saat pubertas ketika tubuh mulai memproduksi cairan reproduksi secara alami.',
      source: 'IDAI — Pubertas Remaja Laki-Laki',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-blue-2',
      path: 'blue',
      category: 'Pubertas',
      myth: 'Jika tinggi badan atau suara belum berubah secepat teman sebaya, berarti pertumbuhan gagal.',
      fact: 'Setiap remaja memiliki jam biologis pubertas berbeda-beda (umumnya dimulai antara usia 10–15 tahun), sehingga kecepatan perubahannya tidak sama persis.',
      source: 'IDAI — Tumbuh Kembang Remaja',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-blue-3',
      path: 'blue',
      category: 'Mental',
      myth: 'Merawat kulit atau mencuci muka secara rutin tidak cocok dilakukan remaja laki-laki.',
      fact: 'Produksi minyak wajah meningkat pada semua remaja saat pubertas. Merawat kebersihan kulit membantu mencegah jerawat meradang dan menjaga kenyamanan diri.',
      source: 'Kemenkes RI — PHBS Remaja',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-blue-4',
      path: 'blue',
      category: 'Mental',
      myth: 'Menahan rasa sedih atau stres sendirian membuat remaja laki-laki terlihat lebih tangguh.',
      fact: 'Memendam tekanan emosional justru memperberat stres. Bercerita kepada orang tepercaya atau konselor adalah cara sehat mengelola kesehatan mental.',
      source: 'BKKBN GenRe & WHO',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-blue-5',
      path: 'blue',
      category: 'Tubuh & Olahraga',
      myth: 'Suplemen pembentuk otot instan atau steroid aman dicoba remaja agar cepat bugar.',
      fact: 'Steroid anabolik dan suplemen tanpa izin edar resmi berisiko merusak organ tubuh serta mengganggu keseimbangan hormon pertumbuhan remaja.',
      source: 'WHO & IDAI',
      reviewDate: '27 November 2026',
    },
    {
      id: 'm-blue-6',
      path: 'blue',
      category: 'Pubertas',
      myth: 'Jika sudah disunat, kebersihan organ reproduksi tidak perlu lagi diperhatikan secara khusus.',
      fact: 'Tetap perlu membersihkan area lipatan dengan air bersih setiap mandi serta mengganti celana dalam katun setiap hari untuk mencegah iritasi.',
      source: 'Kemenkes RI & IDAI',
      reviewDate: '27 November 2026',
    },
  ];

  global.SoraMyths = {
    MYTH_CATEGORIES,
    MYTH_CARDS,
  };
})(window);
