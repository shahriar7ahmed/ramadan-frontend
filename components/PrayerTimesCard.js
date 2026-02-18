"use client";

import { useState, useEffect } from "react";
import { getNextPrayer } from "@/lib/api/prayerTimes";
import styles from "./PrayerTimesCard.module.css";

const PRAYER_DATA = [
    { key: "fajr", name: "Fajr", nameBn: "ফজর", icon: "🌄", note: "Suhur ends" },
    { key: "sunrise", name: "Sunrise", nameBn: "সূর্যোদয়", icon: "🌅", note: "" },
    { key: "dhuhr", name: "Dhuhr", nameBn: "যোহর", icon: "☀️", note: "" },
    { key: "asr", name: "Asr", nameBn: "আসর", icon: "🌤️", note: "" },
    { key: "maghrib", name: "Maghrib", nameBn: "মাগরিব", icon: "🌇", note: "Iftar time" },
    { key: "isha", name: "Isha", nameBn: "ইশা", icon: "🌙", note: "" },
];

/**
 * Card displaying all prayer times with current/next prayer highlighted.
 * @param {{ timings: Object, hijriDate: Object, city: string, compact: boolean }} props
 */
export default function PrayerTimesCard({ timings, hijriDate, city, compact = false }) {
    const [nextPrayer, setNextPrayer] = useState(null);

    useEffect(() => {
        if (!timings) return;

        const updateNext = () => {
            const next = getNextPrayer(timings);
            setNextPrayer(next);
        };

        updateNext();
        const interval = setInterval(updateNext, 60000); // check every minute
        return () => clearInterval(interval);
    }, [timings]);

    if (!timings) {
        return (
            <div className={`${styles.card} glass-card`}>
                <div className={styles.loadingGrid}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`${styles.loadingRow} skeleton`} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.card} glass-card animate-fade-in-up`}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        🕌 Prayer Times
                    </h3>
                    {city && (
                        <p className={styles.location}>
                            📍 {city}
                        </p>
                    )}
                </div>
                {hijriDate && (
                    <div className={styles.hijriDate}>
                        <span className={styles.hijriDay}>{hijriDate.day}</span>
                        <div>
                            <span className={styles.hijriMonth}>{hijriDate.month}</span>
                            <span className={styles.hijriYear}>{hijriDate.year} AH</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Prayer Times List */}
            <div className={styles.list}>
                {PRAYER_DATA.map((prayer, index) => {
                    const time = timings[prayer.key];
                    const isNext =
                        nextPrayer?.name?.toLowerCase().startsWith(prayer.name.toLowerCase());
                    const isIftar = prayer.key === "maghrib";
                    const isSuhur = prayer.key === "fajr";

                    return (
                        <div
                            key={prayer.key}
                            className={`${styles.row} ${isNext ? styles.rowActive : ""} ${isIftar ? styles.rowIftar : ""
                                } ${isSuhur ? styles.rowSuhur : ""}`}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className={styles.rowLeft}>
                                <span className={styles.rowIcon}>{prayer.icon}</span>
                                <div>
                                    <span className={styles.prayerName}>{prayer.name}</span>
                                    <span className={styles.prayerNameBn}>{prayer.nameBn}</span>
                                </div>
                            </div>

                            <div className={styles.rowRight}>
                                {prayer.note && (
                                    <span className={`badge ${isIftar ? "badge-orange" : "badge-gold"}`}>
                                        {prayer.note}
                                    </span>
                                )}
                                <span className={styles.time}>{time?.replace(/\s*\(.*\)/, "")}</span>
                            </div>

                            {isNext && (
                                <div className={styles.nextBadge}>
                                    <span className={styles.nextDot} />
                                    Next
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
