import React, { useState, useEffect, useCallback, useRef } from 'react';
import Toolbar from './components/Toolbar.jsx';
import TabBar from './components/TabBar.jsx';
import PadGrid from './components/PadGrid.jsx';
import HotkeyModal from './components/HotkeyModal.jsx';
import ContextMenu from './components/ContextMenu.jsx';
import { useAudioEngine } from './hooks/useAudioEngine.js';
import { useHotkeys } from './hooks/useHotkeys.js';
import { useStore } from './hooks/useStore.js';
import { serializeBoard, deserializeBoard } from './utils/exportImport.js';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function App() {
  const [pads, setPads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [volume, setVolume] = useState(1.0);
  const [mute, setMute] = useState(false);
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [hotkeyModal, setHotkeyModal] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const { get: storeGet, set: storeSet } = useStore();
  const { playingPads, play, stop, stopAll } = useAudioEngine(volume, mute);

  // Load state from store on mount
  useEffect(() => {
    async function loadState() {
      const [savedPads, savedCategories, savedVolume, savedMute, savedActiveTab] = await Promise.all([
        storeGet('pads'),
        storeGet('categories'),
        storeGet('volume'),
        storeGet('mute'),
        storeGet('activeTab'),
      ]);

      if (savedPads) setPads(savedPads);
      if (savedCategories) setCategories(savedCategories);
      if (savedVolume !== undefined) setVolume(savedVolume);
      if (savedMute !== undefined) setMute(savedMute);
      if (savedActiveTab) setActiveTab(savedActiveTab);
      setInitialized(true);
    }
    loadState();
  }, []);

  // Auto-save state changes
  useEffect(() => {
    if (!initialized) return;
    storeSet('pads', pads);
  }, [pads, initialized]);

  useEffect(() => {
    if (!initialized) return;
    storeSet('categories', categories);
  }, [categories, initialized]);

  useEffect(() => {
    if (!initialized) return;
    storeSet('volume', volume);
  }, [volume, initialized]);

  useEffect(() => {
    if (!initialized) return;
    storeSet('mute', mute);
  }, [mute, initialized]);

  useEffect(() => {
    if (!initialized) return;
    storeSet('activeTab', activeTab);
  }, [activeTab, initialized]);

  // Hotkeys
  useHotkeys(pads, play, stopAll, false, () => {});

  // Filtered pads for display
  const filteredPads = pads.filter(pad => {
    const matchesSearch = !search || pad.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'uncategorized' && !pad.category) ||
      pad.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // Pad actions
  const handleAddPad = useCallback(async () => {
    let filePath = null;
    let fileName = null;
    let padName = 'New Sound';

    if (window.electronAPI) {
      const result = await window.electronAPI.dialog.openFile();
      if (!result.canceled && result.filePaths.length > 0) {
        const srcPath = result.filePaths[0];
        fileName = srcPath.split(/[\\/]/).pop();
        padName = fileName.replace(/\.[^.]+$/, '');
        const destPath = await window.electronAPI.audio.copyFile(srcPath, fileName);
        filePath = destPath;
      } else {
        return; // User cancelled
      }
    }

    const newPad = {
      id: generateId(),
      name: padName,
      filePath,
      category: activeTab !== 'all' && activeTab !== 'uncategorized' ? activeTab : null,
      hotkey: null,
      color: null,
    };

    setPads(prev => [...prev, newPad]);
  }, [activeTab]);

  const handleDrop = useCallback(async (padId, sourcePath, fileName) => {
    if (!window.electronAPI) return;

    try {
      const destPath = await window.electronAPI.audio.copyFile(sourcePath, fileName);
      const padName = fileName.replace(/\.[^.]+$/, '');

      setPads(prev => prev.map(p =>
        p.id === padId
          ? { ...p, filePath: destPath, name: p.name === 'Empty' || !p.filePath ? padName : p.name }
          : p
      ));
    } catch (err) {
      console.error('Drop error:', err);
    }
  }, []);

  const handleRightClick = useCallback((e, pad) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pad });
  }, []);

  const handleRename = useCallback(() => {
    if (!contextMenu) return;
    const pad = contextMenu.pad;
    const newName = window.prompt('Rename pad:', pad.name);
    if (newName && newName.trim()) {
      setPads(prev => prev.map(p => p.id === pad.id ? { ...p, name: newName.trim() } : p));
    }
  }, [contextMenu]);

  const handleSetHotkey = useCallback(() => {
    if (!contextMenu) return;
    setHotkeyModal(contextMenu.pad);
  }, [contextMenu]);

  const handleSaveHotkey = useCallback((hotkey) => {
    if (!hotkeyModal) return;
    // Check for duplicates
    if (hotkey && pads.some(p => p.hotkey === hotkey && p.id !== hotkeyModal.id)) {
      alert(`Hotkey "${hotkey}" is already assigned to another pad.`);
      return;
    }
    setPads(prev => prev.map(p =>
      p.id === hotkeyModal.id ? { ...p, hotkey: hotkey || null } : p
    ));
    setHotkeyModal(null);
  }, [hotkeyModal, pads]);

  const handleChangeCategory = useCallback((categoryId) => {
    if (!contextMenu) return;
    setPads(prev => prev.map(p =>
      p.id === contextMenu.pad.id ? { ...p, category: categoryId } : p
    ));
  }, [contextMenu]);

  const handleDeletePad = useCallback(() => {
    if (!contextMenu) return;
    if (window.confirm(`Delete "${contextMenu.pad.name}"?`)) {
      stop(contextMenu.pad.id);
      setPads(prev => prev.filter(p => p.id !== contextMenu.pad.id));
    }
  }, [contextMenu, stop]);

  // Category actions
  const handleAddCategory = useCallback((name) => {
    const newCat = { id: generateId(), name };
    setCategories(prev => [...prev, newCat]);
  }, []);

  const handleRenameCategory = useCallback((id, name) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  }, []);

  const handleDeleteCategory = useCallback((id) => {
    if (window.confirm('Delete this category? Sounds will become uncategorized.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      setPads(prev => prev.map(p => p.category === id ? { ...p, category: null } : p));
      if (activeTab === id) setActiveTab('all');
    }
  }, [activeTab]);

  // Export/Import
  const handleExport = useCallback(async () => {
    if (!window.electronAPI) return;
    const data = serializeBoard(pads, categories, volume, mute, activeTab);
    const result = await window.electronAPI.board.export(data);
    if (result.success) {
      alert(`Board exported to: ${result.filePath}`);
    }
  }, [pads, categories, volume, mute, activeTab]);

  const handleExportZip = useCallback(async () => {
    if (!window.electronAPI) return;
    const board = serializeBoard(pads, categories, volume, mute, activeTab);
    const result = await window.electronAPI.board.exportZip({ board });
    if (result.success) {
      alert(`Board exported to: ${result.filePath}`);
    }
  }, [pads, categories, volume, mute, activeTab]);

  const handleImport = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.board.import();
    if (result.success && result.data) {
      try {
        const { pads: importedPads, categories: importedCats, settings } = deserializeBoard(result.data, result.soundsDir);
        if (window.confirm('Import will replace current board. Continue?')) {
          stopAll();
          setPads(importedPads);
          setCategories(importedCats);
          if (settings.volume !== undefined) setVolume(settings.volume);
          if (settings.mute !== undefined) setMute(settings.mute);
          if (settings.activeTab) setActiveTab(settings.activeTab);
        }
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    }
  }, [stopAll]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 dark">
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        volume={volume}
        mute={mute}
        onVolumeChange={(v) => { setMute(false); setVolume(v); }}
        onMuteToggle={() => setMute(m => !m)}
        onStopAll={stopAll}
        onExport={handleExport}
        onExportZip={handleExportZip}
        onImport={handleImport}
      />
      <TabBar
        categories={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
      />
      <PadGrid
        pads={filteredPads}
        playingPads={playingPads}
        onPlay={play}
        onRightClick={handleRightClick}
        onAddPad={handleAddPad}
        onDrop={handleDrop}
      />

      {hotkeyModal && (
        <HotkeyModal
          padName={hotkeyModal.name}
          currentHotkey={hotkeyModal.hotkey}
          onSave={handleSaveHotkey}
          onClose={() => setHotkeyModal(null)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          pad={contextMenu.pad}
          categories={categories}
          onRename={handleRename}
          onSetHotkey={handleSetHotkey}
          onChangeCategory={handleChangeCategory}
          onDelete={handleDeletePad}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
