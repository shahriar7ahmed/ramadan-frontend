"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Hook for managing audio recording in the browser.
 * Uses MediaRecorder API to capture user's voice.
 */
export default function useAudioRecorder(maxDurationMs = 120000) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [error, setError] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);

    // Check if supported
    const isSupported =
        typeof window !== "undefined" &&
        navigator.mediaDevices &&
        typeof MediaRecorder !== "undefined";

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
            }
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            setAudioBlob(null);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
            chunksRef.current = [];
            setDuration(0);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            streamRef.current = stream;
            setPermissionGranted(true);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                    ? "audio/webm;codecs=opus"
                    : "audio/webm",
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                setIsRecording(false);
                setIsPaused(false);
                clearInterval(timerRef.current);

                // Stop all tracks
                stream.getTracks().forEach((t) => t.stop());
            };

            mediaRecorder.start(1000); // Collect data every 1s
            setIsRecording(true);

            // Timer
            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                setDuration(elapsed);

                // Auto-stop at max duration
                if (elapsed >= maxDurationMs) {
                    mediaRecorder.stop();
                }
            }, 100);
        } catch (err) {
            console.error("Recording error:", err);
            if (err.name === "NotAllowedError") {
                setError("Microphone permission denied. Please allow microphone access.");
            } else if (err.name === "NotFoundError") {
                setError("No microphone found. Please connect a microphone.");
            } else {
                setError("Failed to start recording: " + err.message);
            }
        }
    }, [audioUrl, maxDurationMs]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    }, [isRecording]);

    // Reset recording
    const resetRecording = useCallback(() => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
        setError(null);
        chunksRef.current = [];
    }, [audioUrl]);

    // Convert blob to base64 for API
    const getBase64 = useCallback(async () => {
        if (!audioBlob) return null;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Remove data:audio/webm;base64, prefix
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });
    }, [audioBlob]);

    // Format duration for display
    const formattedDuration = formatTime(duration);

    return {
        isRecording,
        isPaused,
        duration,
        formattedDuration,
        audioBlob,
        audioUrl,
        error,
        isSupported,
        permissionGranted,
        startRecording,
        stopRecording,
        resetRecording,
        getBase64,
    };
}

function formatTime(ms) {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${String(remainingSecs).padStart(2, "0")}`;
}
