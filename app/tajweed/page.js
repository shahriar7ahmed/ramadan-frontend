"use client";

import { useState, useEffect } from "react";
import { PRACTICE_SURAHS } from "@/lib/data/tajweedRules";
import { getSurahDetail } from "@/lib/api/quran";
import TajweedRecorder from "@/components/TajweedRecorder";
import TajweedResults from "@/components/TajweedResults";
import TajweedChat from "@/components/TajweedChat";
import styles from "./page.module.css";

export default function TajweedPage() {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [arabicText, setArabicText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [view, setView] = useState("select"); // select | record | results
    const [loadingText, setLoadingText] = useState(false);
    const [difficulty, setDifficulty] = useState("beginner");

    // Fetch Arabic text when surah selected
    useEffect(() => {
        if (!selectedSurah || !selectedSurah.number) return;

        async function fetchText() {
            setLoadingText(true);
            try {
                const data = await getSurahDetail(selectedSurah.number);
                if (data?.ayahs) {
                    setArabicText(data.ayahs.map((a) => a.arabic).join(" "));
                }
            } catch (err) {
                console.error("Failed to fetch surah text:", err);
            } finally {
                setLoadingText(false);
            }
        }

        fetchText();
    }, [selectedSurah]);

    const handleSelectSurah = (surah) => {
        setSelectedSurah(surah);
        setAnalysis(null);
        setView("record");
    };

    const handleAnalysisComplete = (result) => {
        setAnalysis(result);
        setView("results");
    };

    const handleRecordAgain = () => {
        setAnalysis(null);
        setView("record");
    };

    const handleBackToSelect = () => {
        setSelectedSurah(null);
        setArabicText("");
        setAnalysis(null);
        setView("select");
    };

    const filteredSurahs = PRACTICE_SURAHS.filter((s) => s.difficulty === difficulty);

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>🎙️ AI Tajweed Assistant</h1>
                    <p className={styles.pageSubtitle}>
                        Record your Quran recitation and get AI-powered Tajweed feedback
                    </p>
                    <p className={styles.pageSubtitleBn}>
                        আপনার কুরআন তিলাওয়াত রেকর্ড করুন এবং AI-চালিত তাজউইদ প্রতিক্রিয়া পান
                    </p>
                </div>

                {/* Step Indicator */}
                <div className={styles.steps}>
                    <div className={`${styles.step} ${view === "select" ? styles.activeStep : ""} ${view !== "select" ? styles.doneStep : ""}`}>
                        <span className={styles.stepNum}>1</span>
                        <span>Select Surah</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${view === "record" ? styles.activeStep : ""} ${view === "results" ? styles.doneStep : ""}`}>
                        <span className={styles.stepNum}>2</span>
                        <span>Record</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${view === "results" ? styles.activeStep : ""}`}>
                        <span className={styles.stepNum}>3</span>
                        <span>Results</span>
                    </div>
                </div>

                {/* View: Surah Selection */}
                {view === "select" && (
                    <div className={styles.selectSection}>
                        <div className={styles.sectionHeader}>
                            <h2>Choose a Surah to Practice</h2>
                            <p>Select a surah or recite any passage — the AI will identify it</p>
                        </div>

                        {/* Difficulty Filter */}
                        <div className={styles.difficultyFilter}>
                            {["beginner", "intermediate", "advanced"].map((d) => (
                                <button
                                    key={d}
                                    className={`${styles.diffBtn} ${difficulty === d ? styles.activeDiff : ""}`}
                                    onClick={() => setDifficulty(d)}
                                >
                                    {d === "beginner" ? "🌱 Beginner" : d === "intermediate" ? "📖 Intermediate" : "⭐ Advanced"}
                                </button>
                            ))}
                        </div>

                        {/* Surah Grid */}
                        <div className={styles.surahGrid}>
                            {filteredSurahs.map((surah) => (
                                <button
                                    key={surah.number}
                                    className={`${styles.surahCard} glass-card`}
                                    onClick={() => handleSelectSurah(surah)}
                                >
                                    <span className={styles.surahNumber}>{surah.number}</span>
                                    <div className={styles.surahInfo}>
                                        <span className={styles.surahName}>{surah.name}</span>
                                        <span className={styles.surahNameBn}>{surah.nameBn}</span>
                                    </div>
                                    <span className={styles.ayahCount}>{surah.ayahCount} ayahs</span>
                                </button>
                            ))}
                        </div>

                        {/* Free recitation option */}
                        <div className={styles.freeRecite}>
                            <button
                                className={`${styles.freeReciteBtn} glass-card`}
                                onClick={() => {
                                    setSelectedSurah({ name: "Free Recitation", nameBn: "মুক্ত তিলাওয়াত" });
                                    setView("record");
                                }}
                            >
                                <span className={styles.freeIcon}>🎤</span>
                                <div>
                                    <strong>Free Recitation</strong>
                                    <p>Recite any passage — the AI will identify and analyze it</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* View: Recording */}
                {view === "record" && (
                    <div className={styles.recordSection}>
                        <button className={styles.backBtn} onClick={handleBackToSelect}>
                            ← Back to Surah Selection
                        </button>

                        {/* Show Arabic text for reference */}
                        {arabicText && !loadingText && (
                            <div className={`${styles.arabicReference} glass-card-flat`}>
                                <h4>Reference Text</h4>
                                <p className={styles.arabicText}>{arabicText}</p>
                            </div>
                        )}

                        {loadingText && (
                            <div className={`${styles.arabicReference} glass-card-flat`}>
                                <p style={{ textAlign: "center", color: "var(--text-tertiary)" }}>Loading surah text...</p>
                            </div>
                        )}

                        <TajweedRecorder
                            selectedSurah={selectedSurah}
                            arabicText={arabicText}
                            onAnalysisComplete={handleAnalysisComplete}
                            onAnalyzing={setAnalyzing}
                        />
                    </div>
                )}

                {/* View: Results */}
                {view === "results" && analysis && (
                    <div className={styles.resultsSection}>
                        <button className={styles.backBtn} onClick={handleBackToSelect}>
                            ← Choose Different Surah
                        </button>

                        <TajweedResults
                            analysis={analysis}
                            onRecordAgain={handleRecordAgain}
                        />

                        {/* Chat - below results */}
                        <div className={styles.chatSection}>
                            <TajweedChat analysisContext={analysis} />
                        </div>
                    </div>
                )}

                {/* How It Works - show on select screen */}
                {view === "select" && (
                    <div className={styles.howItWorks}>
                        <h3>How It Works</h3>
                        <div className={styles.howGrid}>
                            <div className={`${styles.howCard} glass-card-flat`}>
                                <span className={styles.howIcon}>1️⃣</span>
                                <h4>Select a Surah</h4>
                                <p>Choose from popular surahs or recite freely</p>
                            </div>
                            <div className={`${styles.howCard} glass-card-flat`}>
                                <span className={styles.howIcon}>2️⃣</span>
                                <h4>Record Your Recitation</h4>
                                <p>Use your microphone to record (up to 2 minutes)</p>
                            </div>
                            <div className={`${styles.howCard} glass-card-flat`}>
                                <span className={styles.howIcon}>3️⃣</span>
                                <h4>Get AI Feedback</h4>
                                <p>Receive detailed scores, word-level analysis, and tips</p>
                            </div>
                            <div className={`${styles.howCard} glass-card-flat`}>
                                <span className={styles.howIcon}>4️⃣</span>
                                <h4>Ask Questions</h4>
                                <p>Chat with the AI teacher for personalized guidance</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
