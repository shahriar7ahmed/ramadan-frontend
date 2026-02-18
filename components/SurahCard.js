"use client";

import Link from "next/link";
import { BANGLA_SURAH_NAMES } from "@/lib/api/quran";
import styles from "./SurahCard.module.css";

/**
 * Compact card for surah in the list view.
 * @param {{ surah: Object }} props
 */
export default function SurahCard({ surah }) {
    const banglaName = BANGLA_SURAH_NAMES[surah.number] || "";

    return (
        <Link href={`/quran/${surah.number}`} className={`${styles.card} glass-card`}>
            {/* Surah Number */}
            <div className={styles.number}>
                <span className={styles.numberInner}>{surah.number}</span>
            </div>

            {/* Surah Info */}
            <div className={styles.info}>
                <span className={styles.englishName}>{surah.englishName}</span>
                <span className={styles.translation}>{surah.englishNameTranslation}</span>
                {banglaName && <span className={styles.banglaName}>{banglaName}</span>}
            </div>

            {/* Arabic Name + Meta */}
            <div className={styles.right}>
                <span className={styles.arabicName}>{surah.name}</span>
                <div className={styles.meta}>
                    <span className={`badge ${surah.revelationType === "Meccan" ? "badge-gold" : "badge-brown"}`}>
                        {surah.revelationType}
                    </span>
                    <span className={styles.ayahCount}>{surah.numberOfAyahs} Ayahs</span>
                </div>
            </div>
        </Link>
    );
}
