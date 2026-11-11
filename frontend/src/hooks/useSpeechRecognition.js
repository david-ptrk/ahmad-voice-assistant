import { useEffect, useRef, useState } from "react";

export default function useSpeechRecognition(onResult) {
    const [supported, setSupported] = useState(false);
    const [listening, setListening] = useState(false);
    const [error, setError] = useState("");
    
    const recognitionRef = useRef(null);
    const onResultRef = useRef(onResult);
    
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if (!SpeechRecognition) return;
        
        setSupported(true);
        
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
            setListening(true);
            setError("");
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResultRef.current(transcript);
        };
        
        recognition.onerror = (event) => {
            setError(
                event.error === "not-allowed"
                ? "Microphone permission was denied."
                : `Speech recognition error: ${event.error}`
            );
        };
        
        recognition.onend = () => {
            setListening(false);
        };
        
        recognitionRef.current = recognition;
        
        return () => {
            recognition.stop();
        };
    }, []);
    
    function startListening() {
        if (!recognitionRef.current) return;
        
        try {
            setError("");
            recognitionRef.current.start();
        } catch {
            setError("Speech recognition is already running.");
        }
    }
    
    function stopListening() {
        recognitionRef.current?.stop();
    }
    
    return {
        supported,
        listening,
        error,
        startListening,
        stopListening,
    };
}