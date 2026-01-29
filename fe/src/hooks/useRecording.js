"use client";

import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for client-side recording using MediaRecorder API
 * @param {MediaStream} stream - The media stream to record (from getUserMedia or LiveKit)
 * @returns {Object} Recording controls and state
 */
export function useRecording(stream) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingBlob, setRecordingBlob] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const startRecording = useCallback(() => {
        if (!stream) {
            console.error("No media stream available for recording");
            return;
        }

        // Reset previous recording
        chunksRef.current = [];
        setRecordingBlob(null);
        setRecordingDuration(0);

        // Create MediaRecorder with preferred codec
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
                ? 'video/webm;codecs=vp8'
                : 'video/webm';

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 2500000, // 2.5 Mbps
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mimeType });
            setRecordingBlob(blob);
            setIsRecording(false);

            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

        mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event.error);
            setIsRecording(false);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(1000); // Collect data every second
        setIsRecording(true);

        // Start duration timer
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

    }, [stream]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const clearRecording = useCallback(() => {
        setRecordingBlob(null);
        setRecordingDuration(0);
        chunksRef.current = [];
    }, []);

    return {
        isRecording,
        recordingBlob,
        recordingDuration,
        startRecording,
        stopRecording,
        clearRecording,
    };
}

export default useRecording;
