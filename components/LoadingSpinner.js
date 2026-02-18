import styles from "./LoadingSpinner.module.css";

/**
 * Reusable loading spinner with optional message.
 * @param {{ message: string, size: string }} props
 */
export default function LoadingSpinner({ message = "Loading...", size = "default" }) {
    return (
        <div className={`${styles.container} ${styles[size]}`}>
            <div className={styles.spinner}>
                <div className={styles.ring} />
                <span className={styles.icon}>☪</span>
            </div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
