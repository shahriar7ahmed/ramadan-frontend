"use client";

import { useState } from "react";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import styles from "./TajweedRecorder.module.css";

/**
 * Audio recorder component for Tajweed practice.
 * Records user's Quran recitation and sends for analysis.
 */
export default function TajweedRecorder({ selectedSurah, arabicText, onAnalysisComplete, onAnalyzing }) {
    const {
        isRecording,
        formattedDuration,
        audioUrl,
        error,
        isSupported,
        startRecording,
        stopRecording,
        resetRecording,
        getBase64,
    } = useAudioRecorder(120000); // 2 min max

    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState(null);

    // Submit audio for analysis
    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            setAnalyzeError(null);
            onAnalyzing?.(true);

            const audioBase64 = await getBase64();
            if (!audioBase64) {
                throw new Error("No audio to analyze");
            }

            const response = await fetch("/api/tajweed/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    audioBase64,
                    surahName: selectedSurah?.name || null,
                    surahNumber: selectedSurah?.number || null,
                    arabicText: arabicText || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            onAnalysisComplete?.(data.analysis);
        } catch (err) {
            console.error("Analysis error:", err);
            setAnalyzeError(err.message);
        } finally {
            setAnalyzing(false);
            onAnalyzing?.(false);
        }
    };

    if (!isSupported) {
        return (
            <div className={`${styles.container} glass-card`}>
                <div className={styles.unsupported}>
                    <span className={styles.icon}>🎤</span>
                    <h3>Microphone Not Supported</h3>
                    <p>Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} glass-card`}>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {isRecording ? "🔴 Recording..." : audioUrl ? "✅ Recording Complete" : "🎤 Record Your Recitation"}
                </h3>
                {selectedSurah && (
                    <span className={styles.surahLabel}>
                        {selectedSurah.nameBn || selectedSurah.name}
                    </span>
                )}
            </div>

            {/* Recording UI */}
            <div className={styles.recorderArea}>
                {/* Record Button */}
                <button
                    className={`${styles.recordBtn} ${isRecording ? styles.recording : ""}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={analyzing}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                    <span className={styles.recordIcon}>
                        {isRecording ? "⏹" : "🎤"}
                    </span>
                </button>

                {/* Duration */}
                {isRecording && (
                    <div className={styles.duration}>
                        <span className={styles.durationTime}>{formattedDuration}</span>
                        <span className={styles.durationMax}>/ 2:00 max</span>
                    </div>
                )}

                {/* Pulse rings when recording */}
                {isRecording && (
                    <div className={styles.pulseRings}>
                        <div className={`${styles.ring} ${styles.ring1}`} />
                        <div className={`${styles.ring} ${styles.ring2}`} />
                        <div className={`${styles.ring} ${styles.ring3}`} />
                    </div>
                )}
            </div>

            {/* Audio Playback */}
            {audioUrl && !isRecording && (
                <div className={styles.playbackSection}>
                    <audio controls src={audioUrl} className={styles.audioPlayer} />
                    <div className={styles.actions}>
                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? "🔍 Analyzing..." : "🔍 Analyze Tajweed"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={resetRecording}
                            disabled={analyzing}
                        >
                            🔄 Record Again
                        </button>
                    </div>
                </div>
            )}

            {/* Instruction when idle */}
            {!isRecording && !audioUrl && (
                <p className={styles.instruction}>
                    Tap the microphone and recite. The AI will analyze your Tajweed.
                </p>
            )}

            {/* Errors */}
            {(error || analyzeError) && (
                <div className={styles.error}>
                    ⚠️ {error || analyzeError}
                </div>
            )}

            {/* Analyzing Overlay */}
            {analyzing && (
                <div className={styles.analyzingOverlay}>
                    <div className={styles.analyzingSpinner}>☪</div>
                    <p>AI is analyzing your recitation...</p>
                    <p className={styles.analyzingHint}>This may take a few seconds</p>
                </div>
            )}
        </div>
    );
}
