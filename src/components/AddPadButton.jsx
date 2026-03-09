import React from 'react';

export default function AddPadButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        aspect-square min-h-[80px] rounded-xl border-2 border-dashed border-slate-600
        flex flex-col items-center justify-center gap-1
        text-slate-500 hover:text-slate-300 hover:border-slate-400
        transition-all duration-200 cursor-pointer bg-transparent
      "
      title="Add Sound Pad"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs">Add Sound</span>
    </button>
  );
}
