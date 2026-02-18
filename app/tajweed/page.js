import styles from "./page.module.css";

export const metadata = {
    title: "AI Tajweed — Ramadan Companion",
    description:
        "Practice Quran recitation with AI-powered tajweed feedback. Coming soon.",
};

export default function TajweedPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={`glass-card ${styles.card}`}>
                    <div className={styles.iconWrapper}>
                        <span className={styles.icon}>🎙️</span>
                    </div>
                    <h1 className={styles.title}>AI Tajweed Assistant</h1>
                    <p className={styles.subtitle}>Coming Soon</p>
                    <div className="divider" />
                    <p className={styles.description}>
                        We&apos;re building an AI-powered tajweed assistant that will help you
                        perfect your Quran recitation. Here&apos;s what&apos;s planned:
                    </p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🎤</span>
                            <div>
                                <h4>Voice Recording</h4>
                                <p>Record your surah recitation directly in the browser</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📊</span>
                            <div>
                                <h4>Tajweed Analysis</h4>
                                <p>AI analyzes your pronunciation and tajweed rules</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>✅</span>
                            <div>
                                <h4>Real-time Feedback</h4>
                                <p>Get instant corrections and improvement suggestions</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📈</span>
                            <div>
                                <h4>Progress Tracking</h4>
                                <p>Track your improvement over time with scoring</p>
                            </div>
                        </div>
                    </div>

                    <a href="/" className="btn btn-primary" style={{ marginTop: "var(--space-xl)" }}>
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
