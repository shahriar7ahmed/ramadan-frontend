"use client";

import { useMemo } from "react";
import useCountdown from "@/hooks/useCountdown";
import { getNextPrayer } from "@/lib/api/prayerTimes";
import styles from "./CountdownTimer.module.css";

/**
 * Countdown timer that shows time remaining until next Iftar or Suhur.
 * @param {{ timings: Object }} props
 */
export default function CountdownTimer({ timings }) {
    const nextEvent = useMemo(() => {
        if (!timings) return null;

        const now = new Date();
        const maghribParts = timings.maghrib?.replace(/\s*\(.*\)/, "").split(":").map(Number);
        const fajrParts = timings.fajr?.replace(/\s*\(.*\)/, "").split(":").map(Number);

        if (!maghribParts || !fajrParts) return null;

        const maghribTime = new Date();
        maghribTime.setHours(maghribParts[0], maghribParts[1], 0, 0);

        const fajrTime = new Date();
        fajrTime.setHours(fajrParts[0], fajrParts[1], 0, 0);

        // Determine if next event is Iftar (Maghrib) or Suhur (Fajr)
        if (now < fajrTime) {
            return { label: "Suhur Ends", labelBn: "সেহরি শেষ", time: timings.fajr, icon: "🌙" };
        } else if (now < maghribTime) {
            return { label: "Iftar Time", labelBn: "ইফতারের সময়", time: timings.maghrib, icon: "🌅" };
        } else {
            // After Maghrib, next Suhur is tomorrow's Fajr
            return { label: "Suhur Ends", labelBn: "সেহরি শেষ", time: timings.fajr, icon: "🌙" };
        }
    }, [timings]);

    const { hours, minutes, seconds } = useCountdown(nextEvent?.time);

    if (!nextEvent) {
        return (
            <div className={`${styles.container} glass-card`}>
                <div className={styles.loading}>
                    <div className={`${styles.digit} skeleton`} style={{ width: 60, height: 60 }} />
                    <div className={`${styles.digit} skeleton`} style={{ width: 60, height: 60 }} />
                    <div className={`${styles.digit} skeleton`} style={{ width: 60, height: 60 }} />
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} glass-card animate-fade-in-up`}>
            <div className={styles.header}>
                <span className={styles.icon}>{nextEvent.icon}</span>
                <div>
                    <span className={styles.label}>{nextEvent.label}</span>
                    <span className={styles.labelBn}>{nextEvent.labelBn}</span>
                </div>
            </div>

            <div className={styles.timer}>
                <div className={styles.digitGroup}>
                    <div className={styles.digit}>
                        <span className={styles.digitValue}>
                            {String(hours).padStart(2, "0")}
                        </span>
                    </div>
                    <span className={styles.digitLabel}>Hours</span>
                </div>

                <span className={styles.separator}>:</span>

                <div className={styles.digitGroup}>
                    <div className={styles.digit}>
                        <span className={styles.digitValue}>
                            {String(minutes).padStart(2, "0")}
                        </span>
                    </div>
                    <span className={styles.digitLabel}>Minutes</span>
                </div>

                <span className={styles.separator}>:</span>

                <div className={styles.digitGroup}>
                    <div className={`${styles.digit} ${styles.digitSeconds}`}>
                        <span className={styles.digitValue}>
                            {String(seconds).padStart(2, "0")}
                        </span>
                    </div>
                    <span className={styles.digitLabel}>Seconds</span>
                </div>
            </div>

            <div className={styles.timeDisplay}>
                at <strong>{nextEvent.time?.replace(/\s*\(.*\)/, "")}</strong>
            </div>
        </div>
    );
}
