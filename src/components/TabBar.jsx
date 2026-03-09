import React, { useState } from 'react';

export default function TabBar({ categories, activeTab, onTabChange, onAddCategory, onRenameCategory, onDeleteCategory }) {
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');

  const allTabs = [
    { id: 'all', name: 'All Sounds' },
    ...categories,
    { id: 'uncategorized', name: 'Uncategorized' },
  ];

  const startEdit = (cat) => {
    setEditing(cat.id);
    setEditName(cat.name);
  };

  const submitEdit = () => {
    if (editName.trim() && editing) {
      onRenameCategory(editing, editName.trim());
    }
    setEditing(null);
  };

  const submitAdd = () => {
    if (newName.trim()) {
      onAddCategory(newName.trim());
    }
    setAddingNew(false);
    setNewName('');
  };

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-slate-900/50 border-b border-slate-700 overflow-x-auto">
      {allTabs.map(tab => (
        <div key={tab.id} className="flex items-center group">
          {editing === tab.id ? (
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={submitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') submitEdit();
                if (e.key === 'Escape') setEditing(null);
              }}
              className="bg-slate-700 text-white text-sm px-2 py-1 rounded outline-none border border-cyan-500 w-28"
            />
          ) : (
            <button
              onClick={() => onTabChange(tab.id)}
              onDoubleClick={() => tab.id !== 'all' && tab.id !== 'uncategorized' && startEdit(tab)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              {tab.name}
            </button>
          )}

          {tab.id !== 'all' && tab.id !== 'uncategorized' && editing !== tab.id && (
            <button
              onClick={() => onDeleteCategory(tab.id)}
              className="ml-0.5 text-slate-500 hover:text-red-400 text-xs px-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete category"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {addingNew ? (
        <input
          autoFocus
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onBlur={submitAdd}
          onKeyDown={e => {
            if (e.key === 'Enter') submitAdd();
            if (e.key === 'Escape') { setAddingNew(false); setNewName(''); }
          }}
          placeholder="Category name..."
          className="bg-slate-700 text-white text-sm px-2 py-1 rounded outline-none border border-cyan-500 w-36"
        />
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="px-2 py-1.5 text-slate-500 hover:text-cyan-400 text-sm transition-colors"
          title="Add Category"
        >
          + Add Tab
        </button>
      )}
    </div>
  );
}
