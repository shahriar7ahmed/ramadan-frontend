"use client";

import { SEVERITY } from "@/lib/data/tajweedRules";
import styles from "./TajweedResults.module.css";

/**
 * Displays Tajweed analysis results with scores, feedback, and tips.
 */
export default function TajweedResults({ analysis, onRecordAgain }) {
    if (!analysis) return null;

    const {
        overallScore = 0,
        scores = {},
        feedback = [],
        praise = "",
        praiseBn = "",
        summary = "",
        summaryBn = "",
        tipsToImprove = [],
        detectedSurah,
    } = analysis;

    const scoreCategories = [
        { key: "pronunciation", label: "Pronunciation", labelBn: "উচ্চারণ", icon: "👄" },
        { key: "tajweedRules", label: "Tajweed Rules", labelBn: "তাজউইদ", icon: "📜" },
        { key: "fluency", label: "Fluency", labelBn: "সাবলীলতা", icon: "🌊" },
        { key: "accuracy", label: "Accuracy", labelBn: "সঠিকতা", icon: "🎯" },
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return "#22c55e";
        if (score >= 60) return "#eab308";
        if (score >= 40) return "#f97316";
        return "#ef4444";
    };

    return (
        <div className={styles.container}>
            {/* Overall Score */}
            <div className={`${styles.overallCard} glass-card`}>
                <div className={styles.scoreCircle} style={{ "--score-color": getScoreColor(overallScore) }}>
                    <svg viewBox="0 0 100 100" className={styles.scoreSvg}>
                        <circle cx="50" cy="50" r="42" className={styles.scoreBg} />
                        <circle
                            cx="50" cy="50" r="42"
                            className={styles.scoreArc}
                            style={{
                                strokeDasharray: `${(overallScore / 100) * 264} 264`,
                                stroke: getScoreColor(overallScore),
                            }}
                        />
                    </svg>
                    <span className={styles.scoreValue}>{overallScore}</span>
                    <span className={styles.scoreLabel}>Overall</span>
                </div>

                {detectedSurah && (
                    <p className={styles.detectedSurah}>Detected: {detectedSurah}</p>
                )}

                {praise && (
                    <div className={styles.praise}>
                        <p>{praise}</p>
                        {praiseBn && <p className={styles.praiseBn}>{praiseBn}</p>}
                    </div>
                )}
            </div>

            {/* Category Scores */}
            <div className={styles.scoresGrid}>
                {scoreCategories.map(({ key, label, labelBn, icon }) => {
                    const score = scores[key] || 0;
                    return (
                        <div key={key} className={`${styles.scoreCard} glass-card-flat`}>
                            <span className={styles.catIcon}>{icon}</span>
                            <div className={styles.scoreBar}>
                                <div className={styles.scoreBarTrack}>
                                    <div
                                        className={styles.scoreBarFill}
                                        style={{
                                            width: `${score}%`,
                                            background: getScoreColor(score),
                                        }}
                                    />
                                </div>
                                <span className={styles.scoreNum} style={{ color: getScoreColor(score) }}>
                                    {score}
                                </span>
                            </div>
                            <span className={styles.catLabel}>{label}</span>
                            <span className={styles.catLabelBn}>{labelBn}</span>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            {summary && (
                <div className={`${styles.summaryCard} glass-card-flat`}>
                    <h4>📝 Summary</h4>
                    <p>{summary}</p>
                    {summaryBn && <p className={styles.summaryBn}>{summaryBn}</p>}
                </div>
            )}

            {/* Detailed Feedback */}
            {feedback.length > 0 && (
                <div className={styles.feedbackSection}>
                    <h4 className={styles.feedbackTitle}>🔍 Detailed Feedback</h4>
                    <div className={styles.feedbackList}>
                        {feedback.map((item, i) => {
                            const sev = SEVERITY[item.severity] || SEVERITY.minor;
                            return (
                                <div
                                    key={i}
                                    className={`${styles.feedbackItem} glass-card-flat`}
                                    style={{ borderLeftColor: sev.color }}
                                >
                                    <div className={styles.feedbackHeader}>
                                        {item.word && (
                                            <span className={styles.feedbackWord}>{item.word}</span>
                                        )}
                                        <span
                                            className={styles.feedbackSeverity}
                                            style={{ background: sev.color + "18", color: sev.color }}
                                        >
                                            {sev.label}
                                        </span>
                                    </div>
                                    <p className={styles.feedbackIssue}>{item.issue}</p>
                                    {item.issueBn && (
                                        <p className={styles.feedbackIssueBn}>{item.issueBn}</p>
                                    )}
                                    {item.rule && (
                                        <span className={styles.feedbackRule}>
                                            📏 {item.rule} {item.ruleBn ? `(${item.ruleBn})` : ""}
                                        </span>
                                    )}
                                    {item.suggestion && (
                                        <p className={styles.feedbackSuggestion}>
                                            💡 {item.suggestion}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tips */}
            {tipsToImprove?.length > 0 && (
                <div className={`${styles.tipsCard} glass-card`}>
                    <h4>🎓 Tips to Improve</h4>
                    <ul className={styles.tipsList}>
                        {tipsToImprove.map((tip, i) => (
                            <li key={i}>
                                <p>{tip.tip}</p>
                                {tip.tipBn && <p className={styles.tipBn}>{tip.tipBn}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                <button className="btn btn-primary" onClick={onRecordAgain}>
                    🎤 Record Again
                </button>
            </div>
        </div>
    );
}
