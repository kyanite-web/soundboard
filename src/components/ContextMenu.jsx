import React, { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, pad, categories, onRename, onSetHotkey, onChangeCategory, onDelete, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('contextmenu', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('contextmenu', handler);
    };
  }, [onClose]);

  // Adjust position to stay in viewport
  const style = {
    position: 'fixed',
    left: Math.min(x, window.innerWidth - 200),
    top: Math.min(y, window.innerHeight - 250),
    zIndex: 100,
  };

  const MenuItem = ({ onClick, children, danger }) => (
    <button
      onClick={() => { onClick(); onClose(); }}
      className={`
        w-full text-left px-4 py-2 text-sm transition-colors
        ${danger
          ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={menuRef}
      style={style}
      className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl py-1 min-w-[180px]"
    >
      <MenuItem onClick={onRename}>✏️ Rename</MenuItem>
      <MenuItem onClick={onSetHotkey}>⌨️ Set Hotkey</MenuItem>

      {categories.length > 0 && (
        <>
          <div className="border-t border-slate-700 my-1" />
          <div className="px-4 py-1 text-xs text-slate-500 uppercase tracking-wider">Move to category</div>
          <MenuItem onClick={() => onChangeCategory(null)}>📂 Uncategorized</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat.id} onClick={() => onChangeCategory(cat.id)}>
              📁 {cat.name}
            </MenuItem>
          ))}
        </>
      )}

      <div className="border-t border-slate-700 my-1" />
      <MenuItem onClick={onDelete} danger>🗑️ Delete</MenuItem>
    </div>
  );
}
