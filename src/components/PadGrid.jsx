import React from 'react';
import SoundPad from './SoundPad.jsx';
import AddPadButton from './AddPadButton.jsx';

export default function PadGrid({ pads, playingPads, onPlay, onRightClick, onAddPad, onDrop }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {pads.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-lg font-medium">No sounds yet</p>
          <p className="text-sm mt-1">Click "Add Sound" to get started</p>
        </div>
      )}
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 auto-rows-fr">
        {pads.map(pad => (
          <SoundPad
            key={pad.id}
            pad={pad}
            isPlaying={playingPads.has(pad.id)}
            onPlay={onPlay}
            onRightClick={onRightClick}
            onDrop={onDrop}
          />
        ))}
        <AddPadButton onClick={onAddPad} />
      </div>
    </div>
  );
}
