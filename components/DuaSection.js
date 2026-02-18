"use client";

import { useState } from "react";
import { DUAS, DUA_CATEGORIES } from "@/lib/data/duas";
import styles from "./DuaSection.module.css";

/**
 * Duas section for the homepage showing important duas with category filtering.
 */
export default function DuaSection() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [expandedDua, setExpandedDua] = useState(null);

    const filteredDuas =
        activeCategory === "all"
            ? DUAS
            : DUAS.filter((d) => d.category === activeCategory);

    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <h2>🤲 Important Duas</h2>
                    <div className="divider" />
                    <p>Essential supplications for Ramadan and daily life</p>
                    <p className={styles.subtitleBn}>রমজান ও দৈনন্দিন জীবনের জন্য গুরুত্বপূর্ণ দোয়া</p>
                </div>

                {/* Category Filter */}
                <div className={styles.categories}>
                    {DUA_CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            className={`${styles.catBtn} ${activeCategory === cat.value ? styles.catActive : ""}`}
                            onClick={() => setActiveCategory(cat.value)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Duas Grid */}
                <div className={styles.grid}>
                    {filteredDuas.map((dua) => (
                        <div
                            key={dua.id}
                            className={`${styles.card} glass-card`}
                            onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
                        >
                            {/* Card Header */}
                            <div className={styles.cardHeader}>
                                <div>
                                    <h4 className={styles.cardTitle}>{dua.title}</h4>
                                    <span className={styles.cardTitleBn}>{dua.titleBn}</span>
                                </div>
                                <span className={`badge badge-${dua.category === "ramadan" ? "orange" : dua.category === "forgiveness" ? "gold" : "brown"}`}>
                                    {dua.category}
                                </span>
                            </div>

                            {/* Arabic Text */}
                            <div className={styles.arabicBox}>
                                <p className={styles.arabic}>{dua.arabic}</p>
                            </div>

                            {/* Transliteration */}
                            <p className={styles.transliteration}>{dua.transliteration}</p>

                            {/* Expandable Translations */}
                            <div className={`${styles.translations} ${expandedDua === dua.id ? styles.expanded : ""}`}>
                                <div className={styles.bangla}>
                                    <span className={styles.langLabel}>বাংলা:</span>
                                    <p>{dua.bangla}</p>
                                </div>
                                <div className={styles.english}>
                                    <span className={styles.langLabel}>English:</span>
                                    <p>{dua.english}</p>
                                </div>
                            </div>

                            {/* Reference & Toggle */}
                            <div className={styles.cardFooter}>
                                <span className={styles.reference}>📚 {dua.reference}</span>
                                <span className={styles.toggleHint}>
                                    {expandedDua === dua.id ? "Show less ▲" : "Show translations ▼"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
