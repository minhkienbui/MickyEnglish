'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  silenceTimeoutMs?: number; // Tự ngắt sau N mili giây im lặng (mặc định 3500ms)
  onResult?: (finalText: string, interimText: string) => void;
  onError?: (error: any) => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  spokenWords: string[];
  interimText: string;
  fullTranscript: string;
  isSupported: boolean;
  hasPermission: boolean | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Hook quản lý Web Speech API (SpeechRecognition) nhận diện giọng nói tiếng Anh
 * - Nhận diện realtime cả từ interim (đang nói) và final (đã chốt)
 * - Tự động hồi phục khi gặp lỗi sau 500ms
 * - Tự ngắt khi im lặng quá 3.5 giây
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    silenceTimeoutMs = 3500,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [spokenWords, setSpokenWords] = useState<string[]>([]);
  const [interimText, setInterimText] = useState('');
  const [fullTranscript, setFullTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldBeListeningRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  // [1] Kiểm tra hỗ trợ Web Speech API trên trình duyệt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        setIsSupported(false);
      }
    }
  }, []);

  // [2] Reset bộ đếm im lặng (Silence Timer)
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (silenceTimeoutMs > 0) {
      silenceTimerRef.current = setTimeout(() => {
        if (shouldBeListeningRef.current) {
          console.log('[SpeechRecognition] Phát hiện im lặng > 3s, tự ngắt listening.');
          stopListening();
        }
      }, silenceTimeoutMs);
    }
  }, [silenceTimeoutMs]);

  // [3] Hàm dừng lắng nghe
  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    setIsListening(false);
    setInterimText('');

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  }, []);

  // [4] Hàm reset dữ liệu đã nói
  const resetTranscript = useCallback(() => {
    setSpokenWords([]);
    setInterimText('');
    setFullTranscript('');
  }, []);

  // [5] Hàm bắt đầu lắng nghe
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsSupported(false);
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API. Vui lòng dùng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    shouldBeListeningRef.current = true;
    setIsListening(true);
    resetSilenceTimer();

    // Dừng instance cũ nếu có
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition = new SpeechRec();
    recognitionRef.current = recognition;
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    // Khi có âm thanh bắt đầu nói
    recognition.onspeechstart = () => {
      resetSilenceTimer();
    };

    // [CƠ CHẾ NHẬN DIỆN TỪNG CHỮ REAL-TIME]
    recognition.onresult = (event: any) => {
      resetSilenceTimer();
      setHasPermission(true);

      let finalStr = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalStr += result[0].transcript + ' ';
        } else {
          interimStr += result[0].transcript + ' ';
        }
      }

      finalStr = finalStr.trim();
      interimStr = interimStr.trim();

      const combined = (finalStr + ' ' + interimStr).trim();
      setFullTranscript(combined);
      setInterimText(interimStr);

      // Tách mảng từng từ đã chốt (final words)
      if (combined) {
        const wordsArray = combined.split(/\s+/).filter(Boolean);
        setSpokenWords(wordsArray);
      }

      if (onResult) {
        onResult(finalStr, interimStr);
      }
    };

    // [XỬ LÝ LỖI & AUTO-RESTART SAU 500MS]
    recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognition Error]:', event.error);
      if (event.error === 'not-allowed') {
        setHasPermission(false);
        setIsListening(false);
        shouldBeListeningRef.current = false;
        alert('Microphone bị chặn. Vui lòng nhấn vào biểu tượng ổ khóa cạnh thanh địa chỉ để Cho phép (Allow) Microphone.');
        return;
      }

      if (onError) onError(event);

      // Tự động restart nếu bị ngắt kết nối đột ngột
      if (shouldBeListeningRef.current && event.error !== 'aborted') {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (shouldBeListeningRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        }, 500);
      }
    };

    // Khi kết thúc session nhận diện
    recognition.onend = () => {
      if (shouldBeListeningRef.current) {
        try {
          recognition.start();
        } catch {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (shouldBeListeningRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 400);
        }
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('[SpeechRecognition Start Exception]:', err);
    }
  }, [lang, continuous, interimResults, resetSilenceTimer, onResult, onError]);

  // [6] Cleanup khi component unmount
  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  return {
    isListening,
    spokenWords,
    interimText,
    fullTranscript,
    isSupported,
    hasPermission,
    startListening,
    stopListening,
    resetTranscript,
  };
}
