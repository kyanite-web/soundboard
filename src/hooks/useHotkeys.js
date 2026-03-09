import { useEffect, useCallback } from 'react';

function getKeyCombo(e) {
  const parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.metaKey) parts.push('Meta');

  const key = e.key;
  if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }

  return parts.join('+');
}

export function useHotkeys(pads, onPlay, onStopAll, capturingHotkey, onCaptureHotkey) {
  const handleKeyDown = useCallback((e) => {
    // If we're in a capturing mode, pass the key combo to the callback
    if (capturingHotkey) {
      e.preventDefault();
      if (e.key === 'Escape') {
        onCaptureHotkey(null);
      } else {
        onCaptureHotkey(getKeyCombo(e));
      }
      return;
    }

    // Escape = stop all
    if (e.key === 'Escape') {
      onStopAll();
      return;
    }

    // Check if focused on an input
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const combo = getKeyCombo(e);

    const pad = pads.find(p => p.hotkey === combo);
    if (pad) {
      e.preventDefault();
      onPlay(pad);
    }
  }, [pads, onPlay, onStopAll, capturingHotkey, onCaptureHotkey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
