import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                {/* Top Section */}
                <div className={styles.topSection}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <div className={styles.brandLogo}>
                            <span className={styles.brandIcon}>☪</span>
                            <div>
                                <h3 className={styles.brandTitle}>Ramadan Companion</h3>
                                <p className={styles.brandTagline}>
                                    Your complete guide for Ramadan
                                </p>
                            </div>
                        </div>
                        <p className={styles.brandDesc}>
                            Accurate prayer times, Iftar & Suhur schedules, and the Holy Quran
                            with Arabic text, Bangla & English translations, and audio
                            recitation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkGroupTitle}>Quick Links</h4>
                        <Link href="/" className={styles.footerLink}>Home</Link>
                        <Link href="/prayer-times" className={styles.footerLink}>Prayer Times</Link>
                        <Link href="/quran" className={styles.footerLink}>Quran</Link>
                        <Link href="/tajweed" className={styles.footerLink}>Tajweed AI</Link>
                    </div>

                    {/* Resources */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkGroupTitle}>Resources</h4>
                        <span className={styles.footerLink}>Ramadan Calendar</span>
                        <span className={styles.footerLink}>Surah List</span>
                        <span className={styles.footerLink}>Audio Recitation</span>
                    </div>

                    {/* Coming Soon */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkGroupTitle}>Coming Soon</h4>
                        <div className={styles.comingSoon}>
                            <span className={styles.comingIcon}>🎙️</span>
                            <div>
                                <span className={styles.comingTitle}>AI Tajweed</span>
                                <span className={styles.comingDesc}>
                                    Practice recitation with AI feedback
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Ramadan Companion. Built with ❤️ for the
                        Ummah.
                    </p>
                    <p className={styles.apiCredit}>
                        Prayer times by{" "}
                        <a
                            href="https://aladhan.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.apiLink}
                        >
                            Aladhan API
                        </a>{" "}
                        • Quran data by{" "}
                        <a
                            href="https://alquran.cloud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.apiLink}
                        >
                            Al Quran Cloud
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
