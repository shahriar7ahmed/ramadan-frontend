"use client";

import styles from "./SurahDetail.module.css";

/**
 * Full surah display with Arabic, Bangla, and English translations.
 * @param {{ surah: Object, currentAyah: number, onAyahSelect: Function }} props
 */
export default function SurahDetail({ surah, currentAyah, onAyahSelect }) {
    if (!surah) {
        return (
            <div className={styles.loading}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.ayahSkeleton}>
                        <div className={`skeleton ${styles.skelArabic}`} />
                        <div className={`skeleton ${styles.skelBangla}`} />
                        <div className={`skeleton ${styles.skelEnglish}`} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Surah Header */}
            <div className={`${styles.header} glass-card`}>
                <div className={styles.headerTop}>
                    <div>
                        <h1 className={styles.surahName}>{surah.englishName}</h1>
                        <p className={styles.surahMeaning}>{surah.englishNameTranslation}</p>
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.arabicTitle}>{surah.name}</span>
                        <div className={styles.headerMeta}>
                            <span className={`badge ${surah.revelationType === "Meccan" ? "badge-gold" : "badge-brown"}`}>
                                {surah.revelationType}
                            </span>
                            <span className={styles.ayahCount}>{surah.numberOfAyahs} Ayahs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bismillah (except for Surah 9 At-Tawbah) */}
            {surah.number !== 9 && (
                <div className={styles.bismillah}>
                    <span className={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</span>
                    <span className={styles.bismillahTranslation}>
                        In the name of Allah, the Most Gracious, the Most Merciful
                    </span>
                </div>
            )}

            {/* Ayahs */}
            <div className={styles.ayahList}>
                {surah.ayahs?.map((ayah) => (
                    <div
                        key={ayah.number}
                        id={`ayah-${ayah.number}`}
                        className={`${styles.ayahBlock} ${currentAyah === ayah.number ? styles.ayahActive : ""
                            }`}
                        onClick={() => onAyahSelect?.(ayah.number)}
                    >
                        {/* Ayah Number */}
                        <div className={styles.ayahNumber}>
                            <span>{ayah.number}</span>
                        </div>

                        {/* Arabic Text */}
                        <div className={styles.arabicText}>
                            {ayah.arabic}
                        </div>

                        {/* Bangla Translation */}
                        {ayah.bangla && (
                            <div className={styles.banglaText}>
                                {ayah.bangla}
                            </div>
                        )}

                        {/* English Translation */}
                        {ayah.english && (
                            <div className={styles.englishText}>
                                {ayah.english}
                            </div>
                        )}

                        {/* Play button overlay */}
                        <button
                            className={styles.playAyah}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAyahSelect?.(ayah.number);
                            }}
                            aria-label={`Play ayah ${ayah.number}`}
                        >
                            ▶
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
