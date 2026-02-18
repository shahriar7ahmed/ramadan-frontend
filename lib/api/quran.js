const BASE_URL = "https://api.alquran.cloud/v1";

// Editions
const ARABIC_EDITION = "quran-uthmani"; // Arabic Uthmani script
const BANGLA_EDITION = "bn.bengali"; // Bangla translation
const ENGLISH_EDITION = "en.asad"; // English translation (Muhammad Asad)
const AUDIO_EDITION = "ar.alafasy"; // Audio recitation (Mishary Al-Afasy)

/**
 * Get list of all 114 surahs with metadata.
 * @returns {Promise<Array>} Array of surah metadata
 */
export async function getAllSurahs() {
    try {
        const res = await fetch(`${BASE_URL}/surah`, {
            next: { revalidate: 86400 * 7 }, // Cache for a week
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        return data.data.map((surah) => ({
            number: surah.number,
            name: surah.name, // Arabic name
            englishName: surah.englishName,
            englishNameTranslation: surah.englishNameTranslation,
            numberOfAyahs: surah.numberOfAyahs,
            revelationType: surah.revelationType, // "Meccan" or "Medinan"
        }));
    } catch (error) {
        console.error("Failed to fetch surah list:", error);
        throw error;
    }
}

/**
 * Get a single surah with Arabic text, Bangla and English translations.
 * @param {number} surahNumber - 1 to 114
 * @returns {Promise<Object>} Surah with all three editions
 */
export async function getSurahDetail(surahNumber) {
    const editions = `${ARABIC_EDITION},${BANGLA_EDITION},${ENGLISH_EDITION}`;

    try {
        const res = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/${editions}`, {
            next: { revalidate: 86400 * 7 },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        const [arabic, bangla, english] = data.data;

        return {
            number: arabic.number,
            name: arabic.name,
            englishName: arabic.englishName,
            englishNameTranslation: arabic.englishNameTranslation,
            numberOfAyahs: arabic.numberOfAyahs,
            revelationType: arabic.revelationType,
            ayahs: arabic.ayahs.map((ayah, index) => ({
                number: ayah.numberInSurah,
                numberGlobal: ayah.number,
                arabic: ayah.text,
                bangla: bangla.ayahs[index]?.text || "",
                english: english.ayahs[index]?.text || "",
                juz: ayah.juz,
                page: ayah.page,
                hizbQuarter: ayah.hizbQuarter,
            })),
        };
    } catch (error) {
        console.error(`Failed to fetch surah ${surahNumber}:`, error);
        throw error;
    }
}

/**
 * Get surah audio recitation (Mishary Al-Afasy).
 * @param {number} surahNumber - 1 to 114
 * @returns {Promise<Object>} Surah audio data with per-ayah audio URLs
 */
export async function getSurahAudio(surahNumber) {
    try {
        const res = await fetch(`${BASE_URL}/surah/${surahNumber}/${AUDIO_EDITION}`, {
            next: { revalidate: 86400 * 7 },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        const surah = data.data;

        return {
            number: surah.number,
            name: surah.name,
            englishName: surah.englishName,
            ayahs: surah.ayahs.map((ayah) => ({
                number: ayah.numberInSurah,
                audioUrl: ayah.audio,
                audioSecondary: ayah.audioSecondary || [],
            })),
        };
    } catch (error) {
        console.error(`Failed to fetch audio for surah ${surahNumber}:`, error);
        throw error;
    }
}

/**
 * Search the Quran in a specific edition.
 * @param {string} query - Search keyword
 * @param {string} edition - Edition to search in (default: English)
 * @returns {Promise<Object>} Search results
 */
export async function searchQuran(query, edition = ENGLISH_EDITION) {
    try {
        const res = await fetch(
            `${BASE_URL}/search/${encodeURIComponent(query)}/${edition}`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) return { count: 0, matches: [] };

        return {
            count: data.data.count,
            matches: data.data.matches.map((m) => ({
                surahNumber: m.surah.number,
                surahName: m.surah.englishName,
                ayahNumber: m.numberInSurah,
                text: m.text,
                edition: m.edition.identifier,
            })),
        };
    } catch (error) {
        console.error("Quran search failed:", error);
        return { count: 0, matches: [] };
    }
}

/**
 * Bangla names for surahs (first 10 featured surahs).
 * Since the API doesn't provide Bangla surah names, we maintain a local mapping.
 */
export const BANGLA_SURAH_NAMES = {
    1: "আল-ফাতিহা",
    2: "আল-বাকারা",
    3: "আলে-ইমরান",
    4: "আন-নিসা",
    18: "আল-কাহফ",
    36: "ইয়াসীন",
    55: "আর-রাহমান",
    56: "আল-ওয়াকিয়া",
    67: "আল-মুলক",
    78: "আন-নাবা",
    87: "আল-আলা",
    93: "আদ-দুহা",
    94: "আশ-শারহ",
    95: "আত-তীন",
    96: "আল-আলাক",
    97: "আল-ক্বদর",
    99: "আয-যিলযাল",
    100: "আল-আদিয়াত",
    101: "আল-কারিয়া",
    102: "আত-তাকাসুর",
    103: "আল-আসর",
    104: "আল-হুমাযা",
    105: "আল-ফীল",
    106: "কুরাইশ",
    107: "আল-মাউন",
    108: "আল-কাওসার",
    109: "আল-কাফিরূন",
    110: "আন-নাসর",
    111: "আল-লাহাব",
    112: "আল-ইখলাস",
    113: "আল-ফালাক",
    114: "আন-নাস",
};

/**
 * Get featured surahs (commonly recited during Ramadan).
 */
export const FEATURED_SURAHS = [1, 36, 55, 56, 67, 97, 112, 113, 114];
