import { Howl, Howler } from 'howler';

// Map of padId -> array of Howl instances (for multi-play)
const instanceMap = new Map();

export function setGlobalVolume(volume) {
  Howler.volume(volume);
}

export function setGlobalMute(mute) {
  Howler.mute(mute);
}

export function playSound(padId, filePath, onPlay, onStop) {
  if (!filePath) return null;

  const src = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

  const howl = new Howl({
    src: [src],
    html5: false,
    onplay: () => {
      if (onPlay) onPlay(padId);
    },
    onend: () => {
      removeInstance(padId, howl);
      if (!hasPlayingInstances(padId) && onStop) onStop(padId);
    },
    onstop: () => {
      removeInstance(padId, howl);
      if (!hasPlayingInstances(padId) && onStop) onStop(padId);
    },
    onerror: (id, err) => {
      console.error('Howl error for pad', padId, err);
      removeInstance(padId, howl);
      if (!hasPlayingInstances(padId) && onStop) onStop(padId);
    },
  });

  howl.play();

  if (!instanceMap.has(padId)) {
    instanceMap.set(padId, []);
  }
  instanceMap.get(padId).push(howl);

  return howl;
}

export function stopSound(padId) {
  const instances = instanceMap.get(padId) || [];
  instances.forEach(h => {
    try { h.stop(); } catch (e) { /* ignore errors on already-stopped instances */ }
  });
  instanceMap.set(padId, []);
}

export function stopAllSounds() {
  instanceMap.forEach((instances) => {
    instances.forEach(h => {
      try { h.stop(); } catch (e) { /* ignore errors on already-stopped instances */ }
    });
  });
  instanceMap.clear();
}

function removeInstance(padId, howl) {
  const instances = instanceMap.get(padId) || [];
  const idx = instances.indexOf(howl);
  if (idx > -1) instances.splice(idx, 1);
  instanceMap.set(padId, instances);
}

function hasPlayingInstances(padId) {
  const instances = instanceMap.get(padId) || [];
  return instances.some(h => h.playing());
}

export function isPlaying(padId) {
  return hasPlayingInstances(padId);
}
