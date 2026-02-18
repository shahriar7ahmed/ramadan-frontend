/**
 * Tajweed rules reference data.
 * Used to enrich AI feedback with educational context.
 */
export const TAJWEED_RULES = {
    idgham: {
        name: "Idgham",
        nameAr: "إدغام",
        nameBn: "ইদগাম",
        description: "Merging of Nun Sakinah/Tanween into the following letter",
        descriptionBn: "নূন সাকিনাহ/তানউইনকে পরবর্তী অক্ষরে মিলিয়ে পড়া",
        letters: "ي ر م ل و ن",
    },
    ikhfa: {
        name: "Ikhfa",
        nameAr: "إخفاء",
        nameBn: "ইখফা",
        description: "Hiding of Nun Sakinah/Tanween with a nasal sound",
        descriptionBn: "নূন সাকিনাহ/তানউইনকে নাসিকা ধ্বনি দিয়ে গোপন করে পড়া",
        letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    },
    iqlab: {
        name: "Iqlab",
        nameAr: "إقلاب",
        nameBn: "ইকলাব",
        description: "Converting Nun Sakinah/Tanween to Meem before Ba",
        descriptionBn: "বা-এর আগে নূন সাকিনাহ/তানউইনকে মীমে পরিবর্তন করে পড়া",
        letters: "ب",
    },
    izhar: {
        name: "Izhar",
        nameAr: "إظهار",
        nameBn: "ইযহার",
        description: "Clear pronunciation of Nun Sakinah/Tanween",
        descriptionBn: "নূন সাকিনাহ/তানউইনকে স্পষ্টভাবে উচ্চারণ করা",
        letters: "ء هـ ع ح غ خ",
    },
    ghunnah: {
        name: "Ghunnah",
        nameAr: "غنة",
        nameBn: "গুন্নাহ",
        description: "Nasal sound from the nose for 2 beats",
        descriptionBn: "নাক দিয়ে ২ হরকত পরিমাণ নাসিকা ধ্বনি করা",
    },
    madd: {
        name: "Madd",
        nameAr: "مد",
        nameBn: "মাদ",
        description: "Elongation of vowel sounds",
        descriptionBn: "স্বরবর্ণের ধ্বনি দীর্ঘায়িত করা",
        types: ["Natural (2 beats)", "Connected (4-5 beats)", "Separated (4-5 beats)", "Required (6 beats)"],
    },
    qalqalah: {
        name: "Qalqalah",
        nameAr: "قلقلة",
        nameBn: "কলকলাহ",
        description: "Bouncing/echoing sound on specific letters when they have sukoon",
        descriptionBn: "নির্দিষ্ট অক্ষরে সুকুন থাকলে ধ্বনির প্রতিধ্বনি করা",
        letters: "ق ط ب ج د",
    },
    tafkheem: {
        name: "Tafkheem",
        nameAr: "تفخيم",
        nameBn: "তাফখীম",
        description: "Heavy/full pronunciation of certain letters",
        descriptionBn: "নির্দিষ্ট অক্ষরের ভারী/পূর্ণ উচ্চারণ",
        letters: "خ ص ض غ ط ق ظ",
    },
    tarqeeq: {
        name: "Tarqeeq",
        nameAr: "ترقيق",
        nameBn: "তারকীক",
        description: "Light/thin pronunciation of certain letters",
        descriptionBn: "নির্দিষ্ট অক্ষরের হালকা/পাতলা উচ্চারণ",
    },
};

/**
 * Severity levels for feedback.
 */
export const SEVERITY = {
    correct: { label: "Correct", labelBn: "সঠিক", color: "#22c55e" },
    minor: { label: "Minor Issue", labelBn: "ছোট সমস্যা", color: "#eab308" },
    major: { label: "Major Issue", labelBn: "বড় সমস্যা", color: "#ef4444" },
    missed: { label: "Missed Word", labelBn: "বাদ পড়েছে", color: "#ef4444" },
};

/**
 * Short surahs recommended for practice.
 */
export const PRACTICE_SURAHS = [
    { number: 1, name: "Al-Fatiha", nameBn: "আল-ফাতিহা", ayahCount: 7, difficulty: "beginner" },
    { number: 112, name: "Al-Ikhlas", nameBn: "আল-ইখলাস", ayahCount: 4, difficulty: "beginner" },
    { number: 113, name: "Al-Falaq", nameBn: "আল-ফালাক", ayahCount: 5, difficulty: "beginner" },
    { number: 114, name: "An-Nas", nameBn: "আন-নাস", ayahCount: 6, difficulty: "beginner" },
    { number: 108, name: "Al-Kawthar", nameBn: "আল-কাউসার", ayahCount: 3, difficulty: "beginner" },
    { number: 110, name: "An-Nasr", nameBn: "আন-নাসর", ayahCount: 3, difficulty: "beginner" },
    { number: 111, name: "Al-Masad", nameBn: "আল-মাসাদ", ayahCount: 5, difficulty: "beginner" },
    { number: 109, name: "Al-Kafirun", nameBn: "আল-কাফিরুন", ayahCount: 6, difficulty: "intermediate" },
    { number: 107, name: "Al-Ma'un", nameBn: "আল-মাউন", ayahCount: 7, difficulty: "intermediate" },
    { number: 36, name: "Ya-Sin", nameBn: "ইয়াসিন", ayahCount: 83, difficulty: "advanced" },
    { number: 67, name: "Al-Mulk", nameBn: "আল-মুলক", ayahCount: 30, difficulty: "advanced" },
    { number: 55, name: "Ar-Rahman", nameBn: "আর-রহমান", ayahCount: 78, difficulty: "advanced" },
];
