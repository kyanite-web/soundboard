import { useState, useCallback, useEffect } from 'react';
import { playSound, stopSound, stopAllSounds, setGlobalVolume, setGlobalMute, isPlaying } from '../utils/audioManager';

export function useAudioEngine(volume, mute) {
  const [playingPads, setPlayingPads] = useState(new Set());

  useEffect(() => {
    setGlobalVolume(volume);
    setGlobalMute(mute);
  }, [volume, mute]);

  const handlePlay = useCallback((padId) => {
    setPlayingPads(prev => new Set([...prev, padId]));
  }, []);

  const handleStop = useCallback((padId) => {
    setPlayingPads(prev => {
      const next = new Set(prev);
      next.delete(padId);
      return next;
    });
  }, []);

  const play = useCallback((pad) => {
    if (!pad || !pad.filePath) return;
    playSound(pad.id, pad.filePath, handlePlay, handleStop);
  }, [handlePlay, handleStop]);

  const stop = useCallback((padId) => {
    stopSound(padId);
    handleStop(padId);
  }, [handleStop]);

  const stopAll = useCallback(() => {
    stopAllSounds();
    setPlayingPads(new Set());
  }, []);

  return { playingPads, play, stop, stopAll };
}
