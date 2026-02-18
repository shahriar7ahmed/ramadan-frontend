"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getUserLocation,
    loadSavedLocation,
    saveLocation,
    DEFAULT_LOCATION,
} from "@/lib/api/location";

/**
 * Custom hook for managing user geolocation.
 * Tries: 1) saved location, 2) browser geolocation, 3) default (Dhaka)
 *
 * @returns {{
 *   latitude: number,
 *   longitude: number,
 *   city: string,
 *   country: string,
 *   loading: boolean,
 *   error: string|null,
 *   setLocation: Function,
 *   requestPermission: Function,
 * }}
 */
export default function useGeolocation() {
    const [location, setLocationState] = useState({
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        city: DEFAULT_LOCATION.name,
        country: DEFAULT_LOCATION.country,
        nameBn: DEFAULT_LOCATION.nameBn,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set location and persist
    const setLocation = useCallback((loc) => {
        const newLoc = {
            latitude: loc.lat || loc.latitude,
            longitude: loc.lng || loc.longitude,
            city: loc.name || loc.city,
            country: loc.country,
            nameBn: loc.nameBn || loc.city,
        };
        setLocationState(newLoc);
        saveLocation({
            name: newLoc.city,
            lat: newLoc.latitude,
            lng: newLoc.longitude,
            country: newLoc.country,
            nameBn: newLoc.nameBn,
        });
        setError(null);
    }, []);

    // Request browser geolocation
    const requestPermission = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const coords = await getUserLocation();
            const newLoc = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                city: "Your Location",
                country: "",
                nameBn: "আপনার অবস্থান",
            };
            setLocationState(newLoc);
            saveLocation({
                name: "Your Location",
                lat: coords.latitude,
                lng: coords.longitude,
                country: "",
                nameBn: "আপনার অবস্থান",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // On mount: load saved location or try auto-detect
    useEffect(() => {
        const saved = loadSavedLocation();
        if (saved) {
            setLocationState({
                latitude: saved.lat,
                longitude: saved.lng,
                city: saved.name,
                country: saved.country || "",
                nameBn: saved.nameBn || saved.name,
            });
            setLoading(false);
        } else {
            // Try auto-detect, fallback to default
            getUserLocation()
                .then((coords) => {
                    setLocationState({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        city: "Your Location",
                        country: "",
                        nameBn: "আপনার অবস্থান",
                    });
                    saveLocation({
                        name: "Your Location",
                        lat: coords.latitude,
                        lng: coords.longitude,
                        country: "",
                        nameBn: "আপনার অবস্থান",
                    });
                })
                .catch(() => {
                    // Silently use default (Dhaka)
                    setError(null);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    return {
        ...location,
        loading,
        error,
        setLocation,
        requestPermission,
    };
}
