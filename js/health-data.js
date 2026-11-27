// health-data.js – simple question set for the Health Check mini‑app
// Exported as a global variable `healthQuestions` for easy access.

window.healthQuestions = [
  {
    id: 1,
    title: "Berapa kali Anda berolahraga dalam seminggu?",
    options: [
      { label: "Tidak sama sekali", value: 3 },
      { label: "1–2 kali", value: 2 },
      { label: "3–5 kali", value: 1 },
      { label: "lebih dari 5 kali", value: 0 }
    ]
  },
  {
    id: 2,
    title: "Berapa jam tidur rata‑rata Anda per malam?",
    options: [
      { label: "<5 jam", value: 3 },
      { label: "5‑6 jam", value: 2 },
      { label: "7‑8 jam", value: 1 },
      { label: ">8 jam", value: 0 }
    ]
  },
  {
    id: 3,
    title: "Seberapa sering Anda merasa stres?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Kadang‑kadang", value: 1 },
      { label: "Sering", value: 2 },
      { label: "Selalu", value: 3 }
    ]
  }
  // Add more questions up to desired count (e.g., 5‑10) …
];
