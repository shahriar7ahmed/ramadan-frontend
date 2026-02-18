"use client";

import { useState } from "react";
import { getRandomInspiration } from "@/lib/data/inspirations";
import styles from "./DailyInspiration.module.css";

/**
 * Daily inspiration component showing a random Quran ayah
 * paired with a related hadith and explanation.
 * Changes each browser session for variety.
 */
export default function DailyInspiration() {
    const [inspiration] = useState(() => getRandomInspiration());
    const [showBangla, setShowBangla] = useState(true);

    if (!inspiration) return null;

    const { ayah, hadith, explanation, explanationBn, theme } = inspiration;

    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <h2>✨ Daily Inspiration</h2>
                    <div className="divider" />
                    <p>A verse from the Quran and a related Hadith to reflect upon</p>
                </div>

                <div className={styles.layout}>
                    {/* Ayah Card */}
                    <div className={`${styles.ayahCard} glass-card animate-fade-in-up`}>
                        <div className={styles.ayahHeader}>
                            <span className={styles.label}>📖 Quranic Verse</span>
                            <span className={styles.ref}>{ayah.reference}</span>
                        </div>

                        <blockquote className={styles.arabicQuote}>
                            {ayah.arabic}
                        </blockquote>

                        <div className={styles.translationBox}>
                            {/* Language Toggle */}
                            <div className={styles.langToggle}>
                                <button
                                    className={`${styles.langBtn} ${showBangla ? styles.langActive : ""}`}
                                    onClick={() => setShowBangla(true)}
                                >
                                    বাংলা
                                </button>
                                <button
                                    className={`${styles.langBtn} ${!showBangla ? styles.langActive : ""}`}
                                    onClick={() => setShowBangla(false)}
                                >
                                    English
                                </button>
                            </div>

                            <p className={styles.translation}>
                                {showBangla ? ayah.bangla : ayah.english}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Hadith + Explanation */}
                    <div className={styles.rightCol}>
                        {/* Hadith Card */}
                        <div className={`${styles.hadithCard} glass-card animate-fade-in-up delay-200`}>
                            <div className={styles.hadithHeader}>
                                <span className={styles.label}>📜 Related Hadith</span>
                            </div>

                            <blockquote className={styles.hadithText}>
                                &ldquo;{showBangla ? hadith.textBn : hadith.text}&rdquo;
                            </blockquote>

                            <div className={styles.hadithMeta}>
                                <span className={styles.narrator}>— {hadith.narrator}</span>
                                <span className={styles.hadithRef}>{hadith.reference}</span>
                            </div>
                        </div>

                        {/* Explanation Card */}
                        <div className={`${styles.explainCard} glass-card animate-fade-in-up delay-400`}>
                            <div className={styles.explainHeader}>
                                <span className={styles.label}>💡 Reflection</span>
                                <span className={`badge badge-gold`}>{theme}</span>
                            </div>
                            <p className={styles.explainText}>
                                {showBangla ? explanationBn : explanation}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Refresh hint */}
                <p className={styles.refreshHint}>
                    🔄 Refresh the page or visit again for a new inspiration
                </p>
            </div>
        </section>
    );
}
