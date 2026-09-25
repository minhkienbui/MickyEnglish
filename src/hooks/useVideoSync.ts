'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SyncSentence {
  id: string | number;
  startTime: number;
  endTime: number;
  text?: string;
  english?: string;
  vietnameseMeaning?: string;
  vietnamese?: string;
  phonetic?: string;
  words?: string[];
}

export interface UseVideoSyncOptions {
  sentences: SyncSentence[];
  currentTime: number;
  isPlaying: boolean;
  mode?: 'auto-flow' | 'step-by-step';
  leadOffsetSec?: number; // Bù độ trễ âm thanh (mặc định 0.08s)
  onSentenceChange?: (newIndex: number) => void;
  onSentenceEnd?: (endedIndex: number) => void;
  seekVideo?: (seconds: number) => void;
  pauseVideo?: () => void;
  playVideo?: () => void;
}

/**
 * Tìm vị trí câu thoại chính xác theo thời gian thực (Zero Lag, Không có vùng chết)
 */
export function getAccurateSentenceIndex(
  sentences: SyncSentence[],
  time: number,
  offsetSec = 0.08
): number {
  if (!sentences || sentences.length === 0) return 0;
  const t = Math.max(0, time + offsetSec);

  // 1. Kiểm tra trực tiếp trong khoảng [startTime, endTime]
  for (let i = 0; i < sentences.length; i++) {
    if (t >= sentences[i].startTime && t <= sentences[i].endTime) {
      return i;
    }
  }

  // 2. Kiểm tra khoảng liên tục từ startTime câu hiện tại tới startTime câu tiếp theo (xóa bỏ delay giữa các câu)
  for (let i = 0; i < sentences.length; i++) {
    const cur = sentences[i];
    const next = sentences[i + 1];
    const nextStart = next ? next.startTime : cur.endTime + 2.0;

    if (t >= cur.startTime && t < nextStart) {
      return i;
    }
  }

  // 3. Nếu trước câu 1 -> câu 0, nếu sau câu cuối -> câu cuối
  if (t < sentences[0].startTime) return 0;
  return sentences.length - 1;
}

/**
 * [HOOK] useVideoSync: Đồng bộ thời gian phát video YouTube với danh sách câu phụ đề
 * - Nhận diện từng câu đúng nhịp chạy thời gian video, không bị delay
 * - Tự động phát hiện câu hiện tại theo currentTime siêu nhạy (High-frequency sync)
 */
export function useVideoSync({
  sentences,
  currentTime,
  isPlaying,
  mode = 'step-by-step',
  leadOffsetSec = 0.08,
  onSentenceChange,
  onSentenceEnd,
  seekVideo,
  pauseVideo,
  playVideo,
}: UseVideoSyncOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndexRef = useRef(0);

  // [1] Tìm câu phù hợp theo currentTime ngay lập tức
  useEffect(() => {
    if (!sentences || sentences.length === 0) return;

    const accurateIndex = getAccurateSentenceIndex(sentences, currentTime, leadOffsetSec);

    if (accurateIndex !== lastIndexRef.current) {
      lastIndexRef.current = accurateIndex;
      setCurrentIndex(accurateIndex);
      if (onSentenceChange) {
        onSentenceChange(accurateIndex);
      }
    }
  }, [currentTime, sentences, leadOffsetSec, onSentenceChange]);

  // [2] Xử lý tự dừng khi hết câu ở chế độ Step-by-step
  useEffect(() => {
    if (mode === 'step-by-step' && isPlaying && sentences[currentIndex]) {
      const currentSentence = sentences[currentIndex];
      if (currentTime >= currentSentence.endTime) {
        if (pauseVideo) {
          pauseVideo();
        }
        if (onSentenceEnd) {
          onSentenceEnd(currentIndex);
        }
      }
    }
  }, [currentTime, isPlaying, mode, currentIndex, sentences, pauseVideo, onSentenceEnd]);

  // [3] Hàm nhảy đến câu cụ thể
  const jumpToSentence = useCallback(
    (index: number, autoPlay: boolean = true) => {
      if (index < 0 || index >= sentences.length) return;
      const target = sentences[index];
      lastIndexRef.current = index;
      setCurrentIndex(index);

      if (seekVideo) {
        seekVideo(target.startTime);
      }
      if (autoPlay && playVideo) {
        playVideo();
      }
      if (onSentenceChange) {
        onSentenceChange(index);
      }
    },
    [sentences, seekVideo, playVideo, onSentenceChange]
  );

  const nextSentence = useCallback(() => {
    if (currentIndex < sentences.length - 1) {
      jumpToSentence(currentIndex + 1);
    }
  }, [currentIndex, sentences.length, jumpToSentence]);

  const prevSentence = useCallback(() => {
    if (currentIndex > 0) {
      jumpToSentence(currentIndex - 1);
    }
  }, [currentIndex, jumpToSentence]);

  return {
    currentIndex,
    currentSentence: sentences[currentIndex] || sentences[0],
    totalSentences: sentences.length,
    jumpToSentence,
    nextSentence,
    prevSentence,
  };
}
