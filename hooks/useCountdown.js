"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for countdown to a target time string.
 * @param {string} targetTime - Time in "HH:MM" format
 * @returns {{ hours: number, minutes: number, seconds: number, isComplete: boolean }}
 */
export default function useCountdown(targetTime) {
    const computeTimeLeft = useCallback(() => {
        if (!targetTime) return { hours: 0, minutes: 0, seconds: 0 };

        const now = new Date();
        const [hours, minutes] = targetTime
            .replace(/\s*\(.*\)/, "")
            .trim()
            .split(":")
            .map(Number);

        let target = new Date();
        target.setHours(hours, minutes, 0, 0);

        // If target time already passed today, set for tomorrow
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        if (diff <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const totalSeconds = Math.floor(diff / 1000);
        return {
            hours: Math.floor(totalSeconds / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60,
        };
    }, [targetTime]);

    const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft());
    const [isComplete, setIsComplete] = useState(() => {
        const initial = computeTimeLeft();
        return initial.hours === 0 && initial.minutes === 0 && initial.seconds === 0;
    });
    const intervalRef = useRef(null);

    useEffect(() => {
        // Update every second
        intervalRef.current = setInterval(() => {
            const remaining = computeTimeLeft();
            setTimeLeft(remaining);

            if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
                setIsComplete(true);
                clearInterval(intervalRef.current);
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [computeTimeLeft]);

    return { ...timeLeft, isComplete };
}
