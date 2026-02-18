const BASE_URL = "https://api.aladhan.com/v1";

/**
 * Calculation methods:
 * 1 = University of Islamic Sciences, Karachi
 * 2 = Islamic Society of North America (ISNA)
 * 3 = Muslim World League
 * 4 = Umm Al-Qura, Makkah
 * 5 = Egyptian General Authority of Survey
 */
const DEFAULT_METHOD = 1; // Karachi - good for South Asia

/**
 * Get prayer times for a specific date and location.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Date|string} date - Date object or DD-MM-YYYY string
 * @param {number} method - Calculation method (default: 1)
 * @returns {Promise<Object>} Prayer times data
 */
export async function getPrayerTimes(lat, lng, date = new Date(), method = DEFAULT_METHOD) {
    const dateStr = formatDate(date);
    const url = `${BASE_URL}/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=1`;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        const timings = data.data.timings;
        const meta = data.data.meta;
        const hijriDate = data.data.date.hijri;
        const gregorianDate = data.data.date.gregorian;

        return {
            timings: {
                fajr: timings.Fajr,
                sunrise: timings.Sunrise,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                // Suhur ends at Fajr, Iftar is at Maghrib
                suhur: timings.Fajr,
                iftar: timings.Maghrib,
            },
            meta: {
                timezone: meta.timezone,
                method: meta.method.name,
                latitude: meta.latitude,
                longitude: meta.longitude,
            },
            hijriDate: {
                day: hijriDate.day,
                month: hijriDate.month.en,
                monthAr: hijriDate.month.ar,
                year: hijriDate.year,
                designation: hijriDate.designation.abbreviated,
                full: `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`,
            },
            gregorianDate: {
                day: gregorianDate.day,
                month: gregorianDate.month.en,
                year: gregorianDate.year,
                full: gregorianDate.date,
            },
        };
    } catch (error) {
        console.error("Failed to fetch prayer times:", error);
        throw error;
    }
}

/**
 * Get monthly prayer calendar.
 * @param {number} lat
 * @param {number} lng
 * @param {number} year
 * @param {number} month - 1-12
 * @param {number} method
 * @returns {Promise<Array>} Array of daily prayer times
 */
export async function getMonthlyCalendar(lat, lng, year, month, method = DEFAULT_METHOD) {
    const url = `${BASE_URL}/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}&school=1`;

    try {
        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        return data.data.map((day) => ({
            date: day.date.gregorian.date,
            day: day.date.gregorian.day,
            weekday: day.date.gregorian.weekday.en,
            hijriDay: day.date.hijri.day,
            hijriMonth: day.date.hijri.month.en,
            hijriMonthAr: day.date.hijri.month.ar,
            hijriYear: day.date.hijri.year,
            isRamadan: day.date.hijri.month.number === 9,
            timings: {
                fajr: cleanTime(day.timings.Fajr),
                sunrise: cleanTime(day.timings.Sunrise),
                dhuhr: cleanTime(day.timings.Dhuhr),
                asr: cleanTime(day.timings.Asr),
                maghrib: cleanTime(day.timings.Maghrib),
                isha: cleanTime(day.timings.Isha),
                suhur: cleanTime(day.timings.Fajr),
                iftar: cleanTime(day.timings.Maghrib),
            },
        }));
    } catch (error) {
        console.error("Failed to fetch monthly calendar:", error);
        throw error;
    }
}

/**
 * Get Ramadan schedule (Hijri month 9) for a given Hijri year.
 * @param {number} lat
 * @param {number} lng
 * @param {number} hijriYear - Hijri year
 * @param {number} method
 * @returns {Promise<Array>}
 */
export async function getRamadanSchedule(lat, lng, hijriYear, method = DEFAULT_METHOD) {
    const url = `${BASE_URL}/hijriCalendar/${hijriYear}/9?latitude=${lat}&longitude=${lng}&method=${method}&school=1`;

    try {
        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.code !== 200) throw new Error(data.data || "Unknown API error");

        return data.data.map((day, index) => ({
            ramadanDay: index + 1,
            gregorianDate: day.date.gregorian.date,
            gregorianDay: day.date.gregorian.day,
            gregorianMonth: day.date.gregorian.month.en,
            weekday: day.date.gregorian.weekday.en,
            hijriDay: day.date.hijri.day,
            suhur: cleanTime(day.timings.Fajr),
            iftar: cleanTime(day.timings.Maghrib),
            fajr: cleanTime(day.timings.Fajr),
            sunrise: cleanTime(day.timings.Sunrise),
            dhuhr: cleanTime(day.timings.Dhuhr),
            asr: cleanTime(day.timings.Asr),
            maghrib: cleanTime(day.timings.Maghrib),
            isha: cleanTime(day.timings.Isha),
        }));
    } catch (error) {
        console.error("Failed to fetch Ramadan schedule:", error);
        throw error;
    }
}

/**
 * Determine the next prayer from current time.
 * @param {Object} timings - Prayer timings object
 * @returns {{ name: string, time: string, isIftar: boolean, isSuhur: boolean }}
 */
export function getNextPrayer(timings) {
    const now = new Date();
    const prayers = [
        { name: "Fajr", time: timings.fajr, isSuhur: true, isIftar: false },
        { name: "Sunrise", time: timings.sunrise, isSuhur: false, isIftar: false },
        { name: "Dhuhr", time: timings.dhuhr, isSuhur: false, isIftar: false },
        { name: "Asr", time: timings.asr, isSuhur: false, isIftar: false },
        { name: "Maghrib", time: timings.maghrib, isSuhur: false, isIftar: true },
        { name: "Isha", time: timings.isha, isSuhur: false, isIftar: false },
    ];

    for (const prayer of prayers) {
        const prayerTime = parseTimeToDate(prayer.time);
        if (prayerTime > now) {
            return prayer;
        }
    }

    // If all prayers passed, next is Fajr tomorrow
    return { ...prayers[0], name: "Fajr (Tomorrow)" };
}

/**
 * Get time remaining until a specific prayer time.
 * @param {string} timeStr - Time string "HH:MM"
 * @returns {{ hours: number, minutes: number, seconds: number, totalSeconds: number }}
 */
export function getTimeRemaining(timeStr) {
    const now = new Date();
    let target = parseTimeToDate(timeStr);

    // If target time already passed today, set for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    const diff = target - now;
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds, totalSeconds };
}

/* --- Helpers --- */

function formatDate(date) {
    if (typeof date === "string") return date;
    const d = date instanceof Date ? date : new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function cleanTime(timeStr) {
    // Aladhan sometimes returns "05:30 (BST)" — strip timezone
    return timeStr ? timeStr.replace(/\s*\(.*\)/, "").trim() : timeStr;
}

function parseTimeToDate(timeStr) {
    const clean = cleanTime(timeStr);
    const [hours, minutes] = clean.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}
