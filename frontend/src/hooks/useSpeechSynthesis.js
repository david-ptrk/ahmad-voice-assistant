import { useEffect, useState } from "react";

export default function useSpeechSynthesis() {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    
    useEffect(() => {
        setSupported("speechSynthesis" in window);
        
        if (!("speechSynthesis" in window)) return;
        
        const handleEnd = () => setSpeaking(false);
        
        window.speechSynthesis.addEventListener("voiceschanged", handleEnd);
        
        return () => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.removeEventListener(
                "voiceschanged",
                handleEnd
            );
        };
    }, []);
    
    function speak(text) {
        if (!("speechSynthesis" in window)) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.lang = "en-US";
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    }
    
    function stopSpeaking() {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    }
    
    return {
        speaking,
        supported,
        speak,
        stopSpeaking,
    };
}