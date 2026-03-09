import React, { useState, useRef } from 'react';

export default function SoundPad({ pad, isPlaying, onPlay, onRightClick, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (pad.filePath) {
      onPlay(pad);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onRightClick(e, pad);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f => /\.(mp3|wav|ogg|flac|m4a)$/i.test(f.name));
    if (audioFile && onDrop) {
      onDrop(pad.id, audioFile.path || audioFile.name, audioFile.name);
    }
  };

  const colors = {
    cyan: 'bg-cyan-900/40 border-cyan-700/50',
    purple: 'bg-purple-900/40 border-purple-700/50',
    green: 'bg-green-900/40 border-green-700/50',
    orange: 'bg-orange-900/40 border-orange-700/50',
    red: 'bg-red-900/40 border-red-700/50',
    blue: 'bg-blue-900/40 border-blue-700/50',
  };

  const colorClass = pad.color && colors[pad.color] ? colors[pad.color] : 'bg-slate-800/80 border-slate-700/50';

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative aspect-square min-h-[80px] rounded-xl border-2 cursor-pointer
        flex flex-col items-center justify-center gap-1 p-2
        transition-all duration-150 select-none overflow-hidden
        ${colorClass}
        ${isPlaying ? 'pad-playing border-cyan-500' : ''}
        ${isDragOver ? 'border-cyan-400 bg-cyan-900/60 scale-105' : ''}
        ${!pad.filePath ? 'opacity-60' : 'hover:scale-[1.03] hover:border-slate-500 active:scale-[0.97]'}
      `}
    >
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      )}

      {/* Hotkey badge */}
      {pad.hotkey && (
        <div className="absolute top-1.5 left-1.5">
          <kbd className="bg-black/50 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {pad.hotkey}
          </kbd>
        </div>
      )}

      {/* Icon or waveform */}
      {pad.filePath ? (
        <div className={`text-2xl mb-0.5 ${isPlaying ? 'animate-bounce' : ''}`}>
          🔊
        </div>
      ) : (
        <div className="text-slate-600 text-2xl mb-0.5">🎵</div>
      )}

      {/* Name */}
      <span
        className={`
          text-xs font-medium text-center leading-tight px-1 max-w-full truncate w-full
          ${pad.filePath ? 'text-white' : 'text-slate-500'}
        `}
        title={pad.name}
      >
        {pad.name || 'Empty'}
      </span>

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/70 rounded-xl">
          <span className="text-cyan-300 text-xs font-medium">Drop audio</span>
        </div>
      )}
    </div>
  );
}
