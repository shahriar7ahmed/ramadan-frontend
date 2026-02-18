"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage browser notifications for prayer times.
 * Requests permission, schedules notifications before each prayer,
 * and handles cleanup.
 * 
 * @param {Object} timings - Prayer timings object { fajr, dhuhr, asr, maghrib, isha }
 * @param {boolean} enabled - Whether notifications are enabled by user
 * @returns {{ permission, enabled, toggleNotifications, supported }}
 */
export default function usePrayerNotifications(timings, enabled = false) {
    const [permission, setPermission] = useState("default");
    const [isEnabled, setIsEnabled] = useState(false);
    const [supported, setSupported] = useState(false);
    const timeoutsRef = useRef([]);

    // Check support and existing permission
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setSupported(true);
            setPermission(Notification.permission);

            // Restore saved preference
            const saved = localStorage.getItem("ramadan-prayer-notifications");
            if (saved === "true" && Notification.permission === "granted") {
                setIsEnabled(true);
            }
        }
    }, []);

    // Parse time string "HH:MM" to today's Date object
    const parseTime = useCallback((timeStr) => {
        if (!timeStr) return null;
        // Remove timezone info like "(BST)" and trim
        const clean = timeStr.replace(/\s*\(.*?\)\s*/g, "").trim();
        const [h, m] = clean.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return null;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }, []);

    // Schedule notifications for all prayers
    const scheduleNotifications = useCallback(() => {
        // Clear existing timeouts
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        if (!timings || !isEnabled || permission !== "granted") return;

        const prayers = [
            { key: "fajr", name: "Fajr", nameBn: "ফজর", icon: "🌅", note: "Suhur is ending soon!" },
            { key: "dhuhr", name: "Dhuhr", nameBn: "যোহর", icon: "☀️" },
            { key: "asr", name: "Asr", nameBn: "আসর", icon: "🌤️" },
            { key: "maghrib", name: "Maghrib", nameBn: "মাগরিব", icon: "🌅", note: "It's Iftar time!" },
            { key: "isha", name: "Isha", nameBn: "ইশা", icon: "🌙" },
        ];

        const now = new Date();

        prayers.forEach((prayer) => {
            const time = parseTime(timings[prayer.key]);
            if (!time) return;

            // Notification 5 minutes before prayer
            const notifyTime = new Date(time.getTime() - 5 * 60 * 1000);
            const delay = notifyTime.getTime() - now.getTime();

            if (delay > 0) {
                const tid = setTimeout(() => {
                    const body = prayer.note
                        ? `${prayer.nameBn} (${prayer.name}) prayer in 5 minutes! ${prayer.note}`
                        : `${prayer.nameBn} (${prayer.name}) prayer in 5 minutes.`;

                    new Notification(`${prayer.icon} ${prayer.name} Prayer`, {
                        body,
                        icon: "/favicon.ico",
                        badge: "/favicon.ico",
                        tag: `prayer-${prayer.key}`,
                        requireInteraction: false,
                        silent: false,
                    });
                }, delay);

                timeoutsRef.current.push(tid);
            }

            // Notification at exact prayer time
            const delayExact = time.getTime() - now.getTime();
            if (delayExact > 0) {
                const tid2 = setTimeout(() => {
                    const body = prayer.note
                        ? `${prayer.nameBn} (${prayer.name}) - ${prayer.note}`
                        : `${prayer.nameBn} (${prayer.name}) prayer time has arrived.`;

                    new Notification(`${prayer.icon} ${prayer.name} — It's Time!`, {
                        body,
                        icon: "/favicon.ico",
                        badge: "/favicon.ico",
                        tag: `prayer-now-${prayer.key}`,
                        requireInteraction: true,
                        silent: false,
                    });
                }, delayExact);

                timeoutsRef.current.push(tid2);
            }
        });
    }, [timings, isEnabled, permission, parseTime]);

    // Schedule when timings or enabled state changes
    useEffect(() => {
        scheduleNotifications();
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, [scheduleNotifications]);

    // Toggle notifications
    const toggleNotifications = useCallback(async () => {
        if (!supported) return;

        if (!isEnabled) {
            // Request permission
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === "granted") {
                setIsEnabled(true);
                localStorage.setItem("ramadan-prayer-notifications", "true");

                // Show confirmation notification
                new Notification("☪ Notifications Enabled!", {
                    body: "You'll receive alerts 5 minutes before each prayer and at prayer time.",
                    icon: "/favicon.ico",
                });
            }
        } else {
            // Disable
            setIsEnabled(false);
            localStorage.setItem("ramadan-prayer-notifications", "false");
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        }
    }, [isEnabled, supported]);

    return {
        permission,
        enabled: isEnabled,
        toggleNotifications,
        supported,
    };
}
