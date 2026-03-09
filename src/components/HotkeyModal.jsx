import React, { useState, useEffect } from 'react';

export default function HotkeyModal({ padName, currentHotkey, onSave, onClose }) {
  const [capturedKey, setCapturedKey] = useState(currentHotkey || '');
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (!capturing) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setCapturing(false);
        return;
      }

      const parts = [];
      if (e.ctrlKey) parts.push('Ctrl');
      if (e.altKey) parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      if (e.metaKey) parts.push('Meta');

      const key = e.key;
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        parts.push(key.length === 1 ? key.toUpperCase() : key);
      }

      if (parts.length > 0) {
        setCapturedKey(parts.join('+'));
        setCapturing(false);
      }
    };

    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [capturing]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl p-6 w-80 shadow-2xl border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold text-lg mb-1">Set Hotkey</h3>
        <p className="text-slate-400 text-sm mb-4">For: <span className="text-cyan-400">{padName}</span></p>

        <div
          className={`
            h-16 rounded-lg border-2 flex items-center justify-center cursor-pointer mb-4
            transition-all duration-200
            ${capturing
              ? 'border-cyan-500 bg-cyan-950 text-cyan-300 animate-pulse'
              : 'border-slate-600 bg-slate-900 text-white hover:border-slate-500'
            }
          `}
          onClick={() => setCapturing(true)}
        >
          {capturing ? (
            <span className="text-sm">Press any key combination...</span>
          ) : capturedKey ? (
            <kbd className="bg-slate-700 px-3 py-1 rounded text-sm font-mono">{capturedKey}</kbd>
          ) : (
            <span className="text-slate-500 text-sm">Click to capture hotkey</span>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {capturedKey && (
            <button
              onClick={() => { setCapturedKey(''); setCapturing(false); }}
              className="px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(capturedKey)}
            className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
