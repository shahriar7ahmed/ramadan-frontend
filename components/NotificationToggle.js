"use client";

import styles from "./NotificationToggle.module.css";

/**
 * Toggle button for enabling/disabling prayer notifications.
 * @param {{ enabled, onToggle, supported, permission }} props
 */
export default function NotificationToggle({ enabled, onToggle, supported, permission }) {
    if (!supported) return null;

    const isBlocked = permission === "denied";

    return (
        <div className={`${styles.container} glass-card-flat`}>
            <div className={styles.info}>
                <div className={styles.icon}>
                    {enabled ? "🔔" : "🔕"}
                </div>
                <div>
                    <h4 className={styles.title}>Prayer Notifications</h4>
                    <p className={styles.desc}>
                        {isBlocked
                            ? "Notifications blocked. Please enable in browser settings."
                            : enabled
                                ? "You'll be notified 5 minutes before each prayer"
                                : "Get notified before each prayer time"}
                    </p>
                </div>
            </div>

            <button
                className={`${styles.toggleBtn} ${enabled ? styles.active : ""}`}
                onClick={onToggle}
                disabled={isBlocked}
                aria-label={enabled ? "Disable prayer notifications" : "Enable prayer notifications"}
            >
                <span className={styles.toggleThumb} />
            </button>
        </div>
    );
}
