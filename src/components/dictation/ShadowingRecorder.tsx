'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Volume2 } from 'lucide-react';
import { useDictationStore } from '@/stores/useDictationStore';

interface ShadowingRecorderProps {
  sentenceId: string;
  transcript: string;
}

export default function ShadowingRecorder({ sentenceId, transcript }: ShadowingRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

  const { userRecordings, saveRecording } = useDictationStore();
  const recordedUrl = userRecordings[sentenceId];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        saveRecording(sentenceId, audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Không thể truy cập Microphone trên trình duyệt của bạn.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayRecorded = () => {
    if (!recordedAudioRef.current) return;
    if (isPlayingRecorded) {
      recordedAudioRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  return (
    <div className="card-bibung bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
          <Mic className="w-4 h-4 text-blue-600" />
          Chế độ Shadowing (Nói đuổi)
        </h4>
        <span className="text-xs text-blue-700 font-semibold">Ghi âm & Tự so sánh</span>
      </div>

      <div className="bg-white/90 p-4 rounded-xl border border-blue-100 text-center font-bold text-base text-[#17261c]">
        "{transcript}"
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Bắt đầu ghi âm</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-5 py-2.5 rounded-full bg-gray-800 text-white font-bold text-xs flex items-center gap-2 shadow-md animate-bounce cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Dừng ghi âm</span>
          </button>
        )}

        {recordedUrl && (
          <div className="flex items-center gap-2">
            <audio
              ref={recordedAudioRef}
              src={recordedUrl}
              onEnded={() => setIsPlayingRecorded(false)}
            />
            <button
              onClick={togglePlayRecorded}
              className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>Nghe bài ghi âm</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
