import { useState, useEffect, useRef, useCallback } from 'react';

export function usePlayback(totalSteps: number, defaultSpeed: number = 800) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(defaultSpeed);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      // If at the end, restart automatically when play is clicked
      if (!prev && currentIndex >= totalSteps - 1) {
        setCurrentIndex(0);
        return true;
      }
      return !prev;
    });
  }, [currentIndex, totalSteps]);

  useEffect(() => {
    if (currentIndex >= totalSteps && totalSteps > 0) {
      setCurrentIndex(totalSteps - 1);
    }
  }, [totalSteps, currentIndex]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timerRef.current as any);
  }, [isPlaying, playbackSpeed, totalSteps]);

  return {
    currentIndex,
    isPlaying,
    playbackSpeed,
    stepForward,
    stepBackward,
    jumpTo,
    togglePlay,
    setPlaybackSpeed
  };
}
