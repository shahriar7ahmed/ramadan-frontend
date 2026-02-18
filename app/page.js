import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.greeting}>
          <span className={styles.greetingArabic}>رمضان مبارك</span>
          <h1 className={styles.title}>
            Ramadan <span className={styles.titleAccent}>Companion</span>
          </h1>
          <p className={styles.subtitle}>
            Your complete guide for Ramadan — accurate prayer times,
            Iftar & Suhur schedules, and the Holy Quran with translations & audio.
          </p>
          <p className={styles.subtitleBn}>
            রমজানের সম্পূর্ণ সঙ্গী — নামাজের সময়, ইফতার ও সেহরির সময়সূচী,
            এবং পবিত্র কুরআন অনুবাদ ও অডিও সহ।
          </p>
        </div>

        <div className={styles.quickLinks}>
          <a href="/prayer-times" className={`btn btn-primary ${styles.quickLink}`}>
            🕌 Prayer Times
          </a>
          <a href="/quran" className={`btn btn-secondary ${styles.quickLink}`}>
            📖 Explore Quran
          </a>
        </div>
      </div>

      <div className="pattern-overlay" />
    </div>
  );
}
