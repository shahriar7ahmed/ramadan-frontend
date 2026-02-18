/**
 * Get user location from browser geolocation API.
 * @returns {Promise<{ latitude: number, longitude: number }>}
 */
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let message;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission denied. Please select your city manually.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "Location request timed out.";
                        break;
                    default:
                        message = "An unknown error occurred.";
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
            }
        );
    });
}

/**
 * Popular cities with coordinates for quick selection.
 * Focus on Bangladesh + major world cities.
 */
export const POPULAR_CITIES = [
    // Bangladesh
    { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, nameBn: "ঢাকা" },
    { name: "Chittagong", country: "Bangladesh", lat: 22.3569, lng: 91.7832, nameBn: "চট্টগ্রাম" },
    { name: "Sylhet", country: "Bangladesh", lat: 24.8949, lng: 91.8687, nameBn: "সিলেট" },
    { name: "Rajshahi", country: "Bangladesh", lat: 24.3745, lng: 88.6042, nameBn: "রাজশাহী" },
    { name: "Khulna", country: "Bangladesh", lat: 22.8456, lng: 89.5403, nameBn: "খুলনা" },
    { name: "Barishal", country: "Bangladesh", lat: 22.701, lng: 90.3535, nameBn: "বরিশাল" },
    { name: "Rangpur", country: "Bangladesh", lat: 25.7439, lng: 89.2752, nameBn: "রংপুর" },
    { name: "Mymensingh", country: "Bangladesh", lat: 24.7471, lng: 90.4203, nameBn: "ময়মনসিংহ" },
    { name: "Comilla", country: "Bangladesh", lat: 23.4607, lng: 91.1809, nameBn: "কুমিল্লা" },
    { name: "Gazipur", country: "Bangladesh", lat: 23.9999, lng: 90.4203, nameBn: "গাজীপুর" },
    // Middle East
    { name: "Makkah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, nameBn: "মক্কা" },
    { name: "Madinah", country: "Saudi Arabia", lat: 24.4539, lng: 39.6142, nameBn: "মদিনা" },
    { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, nameBn: "দুবাই" },
    // South Asia
    { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, nameBn: "কলকাতা" },
    { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025, nameBn: "দিল্লি" },
    { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, nameBn: "মুম্বাই" },
    { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, nameBn: "করাচি" },
    { name: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479, nameBn: "ইসলামাবাদ" },
    // Europe & Americas
    { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, nameBn: "লন্ডন" },
    { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, nameBn: "নিউ ইয়র্ক" },
    { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, nameBn: "টরন্টো" },
    // Southeast Asia
    { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869, nameBn: "কুয়ালালামপুর" },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, nameBn: "ইস্তানবুল" },
    { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, nameBn: "কায়রো" },
];

/**
 * Default location (Dhaka, Bangladesh).
 */
export const DEFAULT_LOCATION = POPULAR_CITIES[0];

/**
 * Find a city by name from the popular cities list.
 * @param {string} name
 * @returns {Object|undefined}
 */
export function findCity(name) {
    return POPULAR_CITIES.find(
        (city) =>
            city.name.toLowerCase() === name.toLowerCase() ||
            city.nameBn === name
    );
}

/**
 * Save selected location to localStorage.
 * @param {{ name: string, lat: number, lng: number, country: string }} location
 */
export function saveLocation(location) {
    if (typeof window !== "undefined") {
        localStorage.setItem("ramadan_location", JSON.stringify(location));
    }
}

/**
 * Load saved location from localStorage.
 * @returns {Object|null}
 */
export function loadSavedLocation() {
    if (typeof window === "undefined") return null;
    try {
        const saved = localStorage.getItem("ramadan_location");
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}
