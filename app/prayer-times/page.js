"use client";

import { useState, useEffect } from "react";
import useGeolocation from "@/hooks/useGeolocation";
import { getPrayerTimes } from "@/lib/api/prayerTimes";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import CountdownTimer from "@/components/CountdownTimer";
import RamadanCalendar from "@/components/RamadanCalendar";
import LocationSelector from "@/components/LocationSelector";
import styles from "./page.module.css";

export default function PrayerTimesPage() {
    const { latitude, longitude, city, loading: geoLoading, setLocation, requestPermission } =
        useGeolocation();
    const [prayerData, setPrayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationOpen, setLocationOpen] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;

        async function fetchTimes() {
            setLoading(true);
            try {
                const data = await getPrayerTimes(latitude, longitude);
                setPrayerData(data);
            } catch (err) {
                console.error("Prayer times fetch failed:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTimes();
    }, [latitude, longitude]);

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>🕌 Prayer Times</h1>
                    <p className={styles.pageSubtitle}>
                        Accurate prayer times, Iftar & Suhur schedules for your location
                    </p>

                    {/* Location Button */}
                    <button
                        className={styles.locationBtn}
                        onClick={() => setLocationOpen(true)}
                    >
                        <span>📍</span>
                        <span>{city || "Select Location"}</span>
                        <span className={styles.changeLabel}>Change</span>
                    </button>
                </div>

                {/* Top Section: Countdown + Today's Prayers */}
                <div className={styles.topGrid}>
                    <div className={styles.countdownCol}>
                        <CountdownTimer timings={prayerData?.timings} />
                    </div>
                    <div className={styles.prayerCol}>
                        <PrayerTimesCard
                            timings={prayerData?.timings}
                            hijriDate={prayerData?.hijriDate}
                            city={city}
                        />
                    </div>
                </div>

                {/* Ramadan Calendar */}
                <div className={styles.calendarSection}>
                    <RamadanCalendar latitude={latitude} longitude={longitude} />
                </div>
            </div>

            {/* Location Selector Modal */}
            <LocationSelector
                isOpen={locationOpen}
                onClose={() => setLocationOpen(false)}
                onSelect={setLocation}
                currentCity={city}
                onAutoDetect={requestPermission}
            />
        </div>
    );
}
