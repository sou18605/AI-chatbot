import { useEffect, useRef, useState } from "react";

export default function useSpeechRecognition(setMessage) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = e => {
      setMessage(e.results[0][0].transcript);
    };

    recognitionRef.current.onend = () => setListening(false);
  }, [setMessage]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    listening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
    setListening(!listening);
  };

  return { listening, toggleMic };
}
