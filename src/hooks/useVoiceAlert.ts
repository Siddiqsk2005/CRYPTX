import { useCallback } from "react";

export function useVoiceAlert() {
  const speak = useCallback((text: string, urgency: "safe" | "caution" | "danger") => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice based on urgency
    switch (urgency) {
      case "danger":
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        utterance.volume = 1;
        break;
      case "caution":
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        break;
      case "safe":
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.6;
        break;
    }

    // Try to use a more robotic voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Microsoft"))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const alertDangerous = useCallback(() => {
    speak(
      "Warning! Dangerous message detected. This appears to be a scam or phishing attempt. Do not respond or click any links.",
      "danger"
    );
  }, [speak]);

  const alertSuspicious = useCallback(() => {
    speak(
      "Caution. This message has suspicious elements. Please verify the sender before taking any action.",
      "caution"
    );
  }, [speak]);

  const alertSafe = useCallback(() => {
    speak(
      "Message verified as safe.",
      "safe"
    );
  }, [speak]);

  return { alertDangerous, alertSuspicious, alertSafe };
}
