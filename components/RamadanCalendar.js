"use client";

import { useState, useEffect } from "react";
import { getRamadanSchedule } from "@/lib/api/prayerTimes";
import styles from "./RamadanCalendar.module.css";

/**
 * Monthly Ramadan calendar showing Suhur & Iftar times for each day.
 * @param {{ latitude: number, longitude: number }} props
 */
export default function RamadanCalendar({ latitude, longitude }) {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        async function fetchSchedule() {
            setLoading(true);
            setError(null);
            try {
                // Current Hijri year for Ramadan — 1447 AH for 2026
                const data = await getRamadanSchedule(latitude, longitude, 1447);
                setSchedule(data);
            } catch (err) {
                // Fallback: try using monthly Gregorian calendar for March 2026
                try {
                    const { getMonthlyCalendar } = await import("@/lib/api/prayerTimes");
                    const marchData = await getMonthlyCalendar(latitude, longitude, 2026, 3);
                    const aprilData = await getMonthlyCalendar(latitude, longitude, 2026, 4);
                    const allDays = [...marchData, ...aprilData];
                    const ramadanDays = allDays.filter((d) => d.isRamadan);

                    if (ramadanDays.length > 0) {
                        setSchedule(
                            ramadanDays.map((d, i) => ({
                                ramadanDay: i + 1,
                                gregorianDate: d.date,
                                gregorianDay: d.day,
                                gregorianMonth: d.weekday,
                                weekday: d.weekday,
                                hijriDay: d.hijriDay,
                                suhur: d.timings.suhur,
                                iftar: d.timings.iftar,
                                fajr: d.timings.fajr,
                                sunrise: d.timings.sunrise,
                                dhuhr: d.timings.dhuhr,
                                asr: d.timings.asr,
                                maghrib: d.timings.maghrib,
                                isha: d.timings.isha,
                            }))
                        );
                    }
                } catch (fallbackErr) {
                    setError("Failed to load Ramadan schedule. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, [latitude, longitude]);

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    if (loading) {
        return (
            <div className={`${styles.container} glass-card`}>
                <h3 className={styles.title}>📅 Ramadan Schedule</h3>
                <div className={styles.loadingGrid}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`${styles.loadingRow} skeleton`} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.container} glass-card`}>
                <h3 className={styles.title}>📅 Ramadan Schedule</h3>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    if (schedule.length === 0) {
        return (
            <div className={`${styles.container} glass-card`}>
                <h3 className={styles.title}>📅 Ramadan Schedule</h3>
                <p className={styles.empty}>
                    Ramadan schedule is not available yet. The schedule will appear when Ramadan approaches.
                </p>
            </div>
        );
    }

    return (
        <div className={`${styles.container} glass-card animate-fade-in-up`}>
            <div className={styles.header}>
                <h3 className={styles.title}>📅 Ramadan Schedule 1447 AH</h3>
                <p className={styles.subtitle}>
                    Suhur & Iftar times for the entire month
                </p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th className={styles.thWeekday}>Weekday</th>
                            <th className={styles.thSuhur}>Suhur</th>
                            <th className={styles.thIftar}>Iftar</th>
                            <th className={styles.thPrayer}>Fajr</th>
                            <th className={styles.thPrayer}>Dhuhr</th>
                            <th className={styles.thPrayer}>Asr</th>
                            <th className={styles.thPrayer}>Isha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((day) => {
                            const isToday = day.gregorianDate === todayStr;
                            return (
                                <tr
                                    key={day.ramadanDay}
                                    className={`${styles.tableRow} ${isToday ? styles.todayRow : ""}`}
                                >
                                    <td className={styles.dayNum}>{day.ramadanDay}</td>
                                    <td className={styles.date}>{day.gregorianDate}</td>
                                    <td className={styles.weekday}>{day.weekday?.slice(0, 3)}</td>
                                    <td className={styles.suhur}>{day.suhur}</td>
                                    <td className={styles.iftar}>{day.iftar}</td>
                                    <td>{day.fajr}</td>
                                    <td>{day.dhuhr}</td>
                                    <td>{day.asr}</td>
                                    <td>{day.isha}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
