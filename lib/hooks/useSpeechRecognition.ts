'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onTranscript?: (transcript: string) => void;
  continuous?: boolean;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition({
  onTranscript,
  continuous = true,
  language = 'es-ES',
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Verificar soporte del navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;

        // Manejar resultados
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          const fullTranscript = (transcript + finalTranscript + interimTranscript).trim();
          setTranscript(fullTranscript);
          
          if (onTranscript && finalTranscript) {
            onTranscript(fullTranscript);
          }
        };

        // Manejar errores
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError(event.error);
          setIsListening(false);
        };

        // Manejar fin de reconocimiento
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSupported(false);
        setError('Tu navegador no soporta reconocimiento de voz. Intenta con Chrome, Edge o Safari.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, language, onTranscript, transcript]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Reconocimiento de voz no soportado');
      return;
    }

    try {
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Error al iniciar el reconocimiento de voz');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}

