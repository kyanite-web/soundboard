import React from 'react';
import VolumeSlider from './VolumeSlider.jsx';

export default function Toolbar({
  search, onSearchChange,
  volume, mute, onVolumeChange, onMuteToggle,
  onStopAll,
  onExport, onExportZip, onImport
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-700 flex-wrap">
      {/* App title */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-xl">🎚️</span>
        <span className="font-bold text-white text-sm">Soundboard</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[150px] max-w-xs">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sounds..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1" />

      {/* Volume */}
      <VolumeSlider volume={volume} mute={mute} onVolumeChange={onVolumeChange} onMuteToggle={onMuteToggle} />

      {/* Stop All */}
      <button
        onClick={onStopAll}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white rounded-lg text-sm transition-colors border border-red-800/50"
        title="Stop All (Escape)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
        Stop All
      </button>

      {/* Export/Import */}
      <div className="flex gap-1">
        <button
          onClick={onImport}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
          title="Import Board"
        >
          📥 Import
        </button>
        <div className="relative group">
          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
            title="Export Board"
          >
            📤 Export
          </button>
        </div>
      </div>
    </div>
  );
}
