"use client";

import { useState, useMemo } from "react";
import { POPULAR_CITIES } from "@/lib/api/location";
import styles from "./LocationSelector.module.css";

/**
 * Location selector modal with search and popular cities.
 * @param {{ isOpen: boolean, onClose: Function, onSelect: Function, currentCity: string }} props
 */
export default function LocationSelector({ isOpen, onClose, onSelect, currentCity, onAutoDetect }) {
    const [search, setSearch] = useState("");

    const filteredCities = useMemo(() => {
        if (!search.trim()) return POPULAR_CITIES;
        const q = search.toLowerCase();
        return POPULAR_CITIES.filter(
            (city) =>
                city.name.toLowerCase().includes(q) ||
                city.country.toLowerCase().includes(q) ||
                city.nameBn.includes(search)
        );
    }, [search]);

    const handleSelect = (city) => {
        onSelect(city);
        onClose();
        setSearch("");
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} glass-card-strong animate-fade-in-up`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h3 className={styles.title}>📍 Select Location</h3>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* Auto-detect */}
                <button className={`${styles.autoDetect} btn btn-primary`} onClick={() => { onAutoDetect(); onClose(); }}>
                    🎯 Auto-detect My Location
                </button>

                {/* Search */}
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                        autoFocus
                    />
                </div>

                {/* City List */}
                <div className={styles.cityList}>
                    {filteredCities.length === 0 ? (
                        <p className={styles.noResults}>No cities found. Try a different search.</p>
                    ) : (
                        filteredCities.map((city) => (
                            <button
                                key={`${city.name}-${city.country}`}
                                className={`${styles.cityItem} ${currentCity === city.name ? styles.cityActive : ""
                                    }`}
                                onClick={() => handleSelect(city)}
                            >
                                <div className={styles.cityInfo}>
                                    <span className={styles.cityName}>{city.name}</span>
                                    <span className={styles.cityNameBn}>{city.nameBn}</span>
                                </div>
                                <span className={styles.cityCountry}>{city.country}</span>
                                {currentCity === city.name && <span className={styles.check}>✓</span>}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
