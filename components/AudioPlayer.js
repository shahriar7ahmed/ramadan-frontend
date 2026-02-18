"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./AudioPlayer.module.css";

/**
 * Custom audio player for Quran recitation.
 * Supports per-ayah playback with auto-advance.
 * @param {{ audioData: Array, currentAyah: number, onAyahChange: Function }} props
 */
export default function AudioPlayer({ audioData, currentAyah, onAyahChange }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playMode, setPlayMode] = useState("single"); // single, all

    const currentAudioUrl = audioData?.[currentAyah - 1]?.audioUrl;

    // Update audio source when ayah changes
    useEffect(() => {
        if (audioRef.current && currentAudioUrl) {
            audioRef.current.src = currentAudioUrl;
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(() => { });
            }
        }
    }, [currentAudioUrl]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !currentAudioUrl) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [isPlaying, currentAudioUrl]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
        setProgress(
            audioRef.current.duration
                ? (audioRef.current.currentTime / audioRef.current.duration) * 100
                : 0
        );
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        if (playMode === "all" && audioData && currentAyah < audioData.length) {
            // Auto-advance to next ayah
            onAyahChange?.(currentAyah + 1);
        } else {
            setIsPlaying(false);
            setProgress(0);
        }
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        audioRef.current.currentTime = pct * duration;
    };

    const skipPrev = () => {
        if (currentAyah > 1) {
            onAyahChange?.(currentAyah - 1);
        }
    };

    const skipNext = () => {
        if (audioData && currentAyah < audioData.length) {
            onAyahChange?.(currentAyah + 1);
        }
    };

    const formatTime = (t) => {
        if (!t || isNaN(t)) return "0:00";
        const mins = Math.floor(t / 60);
        const secs = Math.floor(t % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!audioData || audioData.length === 0) return null;

    return (
        <div className={`${styles.player} glass-card-strong`}>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* Ayah indicator */}
            <div className={styles.ayahInfo}>
                <span className={styles.ayahLabel}>Ayah {currentAyah}</span>
                <span className={styles.ayahTotal}>of {audioData.length}</span>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <button
                    className={styles.controlBtn}
                    onClick={skipPrev}
                    disabled={currentAyah <= 1}
                    aria-label="Previous ayah"
                >
                    ⏮
                </button>

                <button
                    className={styles.playBtn}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? "⏸" : "▶️"}
                </button>

                <button
                    className={styles.controlBtn}
                    onClick={skipNext}
                    disabled={!audioData || currentAyah >= audioData.length}
                    aria-label="Next ayah"
                >
                    ⏭
                </button>
            </div>

            {/* Progress bar */}
            <div className={styles.progressWrapper}>
                <span className={styles.time}>{formatTime(currentTime)}</span>
                <div className={styles.progressBar} onClick={handleSeek}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
                </div>
                <span className={styles.time}>{formatTime(duration)}</span>
            </div>

            {/* Play mode toggle */}
            <div className={styles.modeToggle}>
                <button
                    className={`${styles.modeBtn} ${playMode === "single" ? styles.modeBtnActive : ""}`}
                    onClick={() => setPlayMode("single")}
                >
                    Single
                </button>
                <button
                    className={`${styles.modeBtn} ${playMode === "all" ? styles.modeBtnActive : ""}`}
                    onClick={() => setPlayMode("all")}
                >
                    Play All
                </button>
            </div>
        </div>
    );
}
