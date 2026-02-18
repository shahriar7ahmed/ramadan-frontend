"use client";

import { useState, useEffect } from "react";
import useGeolocation from "@/hooks/useGeolocation";
import { getPrayerTimes } from "@/lib/api/prayerTimes";
import HeroSection from "@/components/HeroSection";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import LocationSelector from "@/components/LocationSelector";
import FeaturedSurahs from "@/components/FeaturedSurahs";
import styles from "./page.module.css";

export default function Home() {
  const { latitude, longitude, city, setLocation, requestPermission } =
    useGeolocation();
  const [prayerData, setPrayerData] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);

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
                <a href="/quran" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  Browse Surahs →
                </a>
              </div>

              <div className={`glass-card ${styles.infoCard}`}>
                <span className={styles.infoIcon}>📅</span>
                <h4>Ramadan Calendar</h4>
                <p>View Suhur & Iftar times for the entire month of Ramadan</p>
                <a href="/prayer-times" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  View Calendar →
                </a>
              </div>

              <div className={`glass-card ${styles.infoCard} ${styles.comingSoonCard}`}>
                <span className={styles.infoIcon}>🎙️</span>
                <h4>AI Tajweed</h4>
                <p>Practice Quran recitation with AI-powered tajweed feedback</p>
                <span className="badge badge-orange">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
