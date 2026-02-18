"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";
import styles from "./HeroSection.module.css";

/**
 * Hero section with Ramadan greeting and Iftar/Suhur countdown.
 * @param {{ timings: Object, city: string, onLocationClick: Function }} props
 */
export default function HeroSection({ timings, city, onLocationClick }) {
    return (
        <section className={styles.hero}>
            <div className={styles.bgDecor}>
                <div className={styles.circle1} />
                <div className={styles.circle2} />
                <div className={styles.circle3} />
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.greeting}>
                    <span className={styles.arabicGreeting}>رمضان مبارك</span>
                    <h1 className={styles.title}>
                        Ramadan <span className={styles.accent}>Companion</span>
                    </h1>
                    <p className={styles.subtitleBn}>রমজানের সম্পূর্ণ সঙ্গী</p>
                    <p className={styles.subtitle}>
                        Accurate prayer times, Iftar & Suhur schedules, and the Holy Quran
                        with translations & audio recitation.
                    </p>
                </div>

                {/* Location display */}
                {city && (
                    <button className={styles.locationPill} onClick={onLocationClick}>
                        <span className={styles.locationIcon}>📍</span>
                        <span>{city}</span>
                        <span className={styles.changeText}>Change</span>
                    </button>
                )}

                {/* Countdown Timer */}
                <div className={styles.countdownWrapper}>
                    <CountdownTimer timings={timings} />
                </div>

                {/* Quick Actions */}
                <div className={styles.actions}>
                    <a href="/prayer-times" className={`btn btn-primary ${styles.actionBtn}`}>
                        🕌 Prayer Times
                    </a>
                    <a href="/quran" className={`btn btn-secondary ${styles.actionBtn}`}>
                        📖 Explore Quran
                    </a>
                </div>
            </div>

            <div className="pattern-overlay" />
        </section>
    );
}
