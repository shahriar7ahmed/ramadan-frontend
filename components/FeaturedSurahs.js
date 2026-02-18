"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllSurahs, FEATURED_SURAHS, BANGLA_SURAH_NAMES } from "@/lib/api/quran";
import styles from "./FeaturedSurahs.module.css";

/**
 * Featured surahs section for the home page.
 * Shows commonly recited surahs during Ramadan.
 */
export default function FeaturedSurahs() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSurahs() {
            try {
                const all = await getAllSurahs();
                const featured = FEATURED_SURAHS.map((num) =>
                    all.find((s) => s.number === num)
                ).filter(Boolean);
                setSurahs(featured);
            } catch (err) {
                console.error("Failed to load featured surahs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSurahs();
    }, []);

    if (loading) {
        return (
            <section className={`section ${styles.section}`}>
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Surahs</h2>
                        <div className="divider" />
                        <p>Commonly recited during Ramadan</p>
                    </div>
                    <div className={styles.grid}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`${styles.skelCard} skeleton`} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (surahs.length === 0) return null;

    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <h2>Featured Surahs</h2>
                    <div className="divider" />
                    <p>Commonly recited during Ramadan</p>
                </div>

                <div className={styles.grid}>
                    {surahs.map((surah, i) => (
                        <Link
                            key={surah.number}
                            href={`/quran/${surah.number}`}
                            className={`${styles.card} glass-card animate-fade-in-up`}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className={styles.cardNumber}>
                                <span>{surah.number}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <span className={styles.cardArabic}>{surah.name}</span>
                                <span className={styles.cardEnglish}>{surah.englishName}</span>
                                <span className={styles.cardMeaning}>{surah.englishNameTranslation}</span>
                                {BANGLA_SURAH_NAMES[surah.number] && (
                                    <span className={styles.cardBangla}>{BANGLA_SURAH_NAMES[surah.number]}</span>
                                )}
                            </div>
                            <div className={styles.cardMeta}>
                                <span className={`badge ${surah.revelationType === "Meccan" ? "badge-gold" : "badge-brown"}`}>
                                    {surah.revelationType}
                                </span>
                                <span className={styles.cardAyahs}>{surah.numberOfAyahs} Ayahs</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.viewAll}>
                    <Link href="/quran" className="btn btn-secondary">
                        📖 View All 114 Surahs →
                    </Link>
                </div>
            </div>
        </section>
    );
}
