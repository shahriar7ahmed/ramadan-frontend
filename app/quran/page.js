"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllSurahs } from "@/lib/api/quran";
import SurahCard from "@/components/SurahCard";
import styles from "./page.module.css";

export default function QuranPage() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all, meccan, medinan
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSurahs() {
            try {
                const data = await getAllSurahs();
                setSurahs(data);
            } catch (err) {
                setError("Failed to load surahs. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchSurahs();
    }, []);

    const filteredSurahs = useMemo(() => {
        let result = surahs;

        // Filter by revelation type
        if (filter !== "all") {
            result = result.filter(
                (s) => s.revelationType.toLowerCase() === filter
            );
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.englishName.toLowerCase().includes(q) ||
                    s.englishNameTranslation.toLowerCase().includes(q) ||
                    s.name.includes(search) ||
                    String(s.number) === q
            );
        }

        return result;
    }, [surahs, search, filter]);

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Page Header */}
                <div className={`section-header ${styles.header}`}>
                    <h1>📖 The Holy Quran</h1>
                    <div className="divider" />
                    <p>114 Surahs with Arabic text, Bangla & English translations, and audio recitation</p>
                </div>

                {/* Search & Filter Bar */}
                <div className={`${styles.toolbar} glass-card-flat`}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search surah by name or number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                        {search && (
                            <button className={styles.clearBtn} onClick={() => setSearch("")}>
                                ✕
                            </button>
                        )}
                    </div>

                    <div className={styles.filters}>
                        {[
                            { value: "all", label: "All" },
                            { value: "meccan", label: "Meccan" },
                            { value: "medinan", label: "Medinan" },
                        ].map((f) => (
                            <button
                                key={f.value}
                                className={`${styles.filterBtn} ${filter === f.value ? styles.filterActive : ""}`}
                                onClick={() => setFilter(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                <p className={styles.resultCount}>
                    {filteredSurahs.length} surah{filteredSurahs.length !== 1 ? "s" : ""} found
                </p>

                {/* Error State */}
                {error && (
                    <div className={`glass-card ${styles.errorCard}`}>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className={styles.grid}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`${styles.skelCard} skeleton`} />
                        ))}
                    </div>
                )}

                {/* Surah Grid */}
                {!loading && !error && (
                    <div className={styles.grid}>
                        {filteredSurahs.map((surah) => (
                            <SurahCard key={surah.number} surah={surah} />
                        ))}
                    </div>
                )}

                {/* No results */}
                {!loading && !error && filteredSurahs.length === 0 && (
                    <div className={`glass-card ${styles.empty}`}>
                        <p>No surahs found matching &quot;{search}&quot;</p>
                        <button className="btn btn-secondary" onClick={() => { setSearch(""); setFilter("all"); }}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
