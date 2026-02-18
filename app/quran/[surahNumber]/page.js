"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getSurahDetail, getSurahAudio } from "@/lib/api/quran";
import SurahDetail from "@/components/SurahDetail";
import AudioPlayer from "@/components/AudioPlayer";
import styles from "./page.module.css";

export default function SurahPage({ params }) {
    const { surahNumber } = use(params);
    const num = parseInt(surahNumber, 10);

    const [surah, setSurah] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [currentAyah, setCurrentAyah] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isNaN(num) || num < 1 || num > 114) {
            setError("Invalid surah number. Please select a surah between 1 and 114.");
            setLoading(false);
            return;
        }

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const [surahData, audio] = await Promise.all([
                    getSurahDetail(num),
                    getSurahAudio(num),
                ]);
                setSurah(surahData);
                setAudioData(audio.ayahs);
            } catch (err) {
                setError("Failed to load surah. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [num]);

    // Scroll to active ayah when it changes
    useEffect(() => {
        if (currentAyah && typeof window !== "undefined") {
            const el = document.getElementById(`ayah-${currentAyah}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [currentAyah]);

    if (error) {
        return (
            <div className={styles.page}>
                <div className="container">
                    <div className={`glass-card ${styles.errorCard}`}>
                        <p>{error}</p>
                        <Link href="/quran" className="btn btn-primary">
                            ← Back to Quran
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Breadcrumb Navigation */}
                <nav className={styles.breadcrumb}>
                    <Link href="/quran" className={styles.breadcrumbLink}>
                        📖 Quran
                    </Link>
                    <span className={styles.breadcrumbSep}>›</span>
                    <span className={styles.breadcrumbCurrent}>
                        {surah ? surah.englishName : `Surah ${num}`}
                    </span>
                </nav>

                {/* Surah Navigation */}
                <div className={styles.surahNav}>
                    {num > 1 && (
                        <Link href={`/quran/${num - 1}`} className={`btn btn-ghost ${styles.navBtn}`}>
                            ← Previous Surah
                        </Link>
                    )}
                    <div className={styles.navSpacer} />
                    {num < 114 && (
                        <Link href={`/quran/${num + 1}`} className={`btn btn-ghost ${styles.navBtn}`}>
                            Next Surah →
                        </Link>
                    )}
                </div>

                {/* Surah Detail */}
                <SurahDetail
                    surah={surah}
                    currentAyah={currentAyah}
                    onAyahSelect={setCurrentAyah}
                />

                {/* Bottom Navigation */}
                <div className={`${styles.surahNav} ${styles.bottomNav}`}>
                    {num > 1 && (
                        <Link href={`/quran/${num - 1}`} className="btn btn-secondary">
                            ← Previous Surah
                        </Link>
                    )}
                    <Link href="/quran" className="btn btn-ghost">
                        View All Surahs
                    </Link>
                    {num < 114 && (
                        <Link href={`/quran/${num + 1}`} className="btn btn-secondary">
                            Next Surah →
                        </Link>
                    )}
                </div>
            </div>

            {/* Sticky Audio Player */}
            {audioData && audioData.length > 0 && (
                <AudioPlayer
                    audioData={audioData}
                    currentAyah={currentAyah}
                    onAyahChange={setCurrentAyah}
                />
            )}
        </div>
    );
}
