"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useGeolocation from "@/hooks/useGeolocation";
import usePrayerNotifications from "@/hooks/usePrayerNotifications";
import { getPrayerTimes } from "@/lib/api/prayerTimes";
import HeroSection from "@/components/HeroSection";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import LocationSelector from "@/components/LocationSelector";
import NotificationToggle from "@/components/NotificationToggle";
import FeaturedSurahs from "@/components/FeaturedSurahs";
import DuaSection from "@/components/DuaSection";
import DailyInspiration from "@/components/DailyInspiration";
import styles from "./page.module.css";

export default function Home() {
  const { latitude, longitude, city, setLocation, requestPermission } =
    useGeolocation();
  const [prayerData, setPrayerData] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);

  // Prayer notifications
  const { permission, enabled, toggleNotifications, supported } =
    usePrayerNotifications(prayerData?.timings);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchTimes() {
      try {
        const data = await getPrayerTimes(latitude, longitude);
        setPrayerData(data);
      } catch (err) {
        console.error("Prayer times fetch failed:", err);
      }
    }

    fetchTimes();
  }, [latitude, longitude]);

  return (
    <div className={styles.page}>
      {/* Hero with Countdown */}
      <HeroSection
        timings={prayerData?.timings}
        city={city}
        onLocationClick={() => setLocationOpen(true)}
      />

      {/* Today's Prayer Times */}
      <section className={`section ${styles.prayerSection}`}>
        <div className="container">
          <div className="section-header">
            <h2>Today&apos;s Prayer Times</h2>
            <div className="divider" />
            <p>Accurate times based on your location</p>
          </div>

          {/* Notification Toggle */}
          <div className={styles.notifRow}>
            <NotificationToggle
              enabled={enabled}
              onToggle={toggleNotifications}
              supported={supported}
              permission={permission}
            />
          </div>

          <div className={styles.prayerGrid}>
            <PrayerTimesCard
              timings={prayerData?.timings}
              hijriDate={prayerData?.hijriDate}
              city={city}
            />

            {/* Quick Info Cards */}
            <div className={styles.infoCards}>
              <div className={`glass-card ${styles.infoCard}`}>
                <span className={styles.infoIcon}>📖</span>
                <h4>Explore Quran</h4>
                <p>Read surahs in Arabic with Bangla & English translations and audio</p>
                <Link href="/quran" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  Browse Surahs →
                </Link>
              </div>

              <div className={`glass-card ${styles.infoCard}`}>
                <span className={styles.infoIcon}>📅</span>
                <h4>Ramadan Calendar</h4>
                <p>View Suhur & Iftar times for the entire month of Ramadan</p>
                <Link href="/prayer-times" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  View Calendar →
                </Link>
              </div>

              <div className={`glass-card ${styles.infoCard}`}>
                <span className={styles.infoIcon}>🎙️</span>
                <h4>AI Tajweed</h4>
                <p>Practice Quran recitation with AI-powered tajweed feedback</p>
                <Link href="/tajweed" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  Try Tajweed →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Inspiration — Random Ayah + Hadith */}
      <DailyInspiration />

      {/* Important Duas */}
      <DuaSection />

      {/* Featured Surahs */}
      <FeaturedSurahs />

      {/* Location Selector */}
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
