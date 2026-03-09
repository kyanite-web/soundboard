import React from 'react';

export default function VolumeSlider({ volume, mute, onVolumeChange, onMuteToggle }) {
  const displayVolume = Math.round(volume * 100);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onMuteToggle}
        className="text-slate-400 hover:text-white transition-colors p-1"
        title={mute ? 'Unmute' : 'Mute'}
      >
        {mute || volume === 0 ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : volume < 0.5 ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={mute ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24 accent-cyan-500 cursor-pointer"
        title={`Volume: ${displayVolume}%`}
      />
      <span className="text-slate-400 text-xs w-8 text-right">{mute ? '0' : displayVolume}%</span>
    </div>
  );
}
