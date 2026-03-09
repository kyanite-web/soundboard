# Soundboard

A full-featured desktop soundboard application built with Electron, React, and Howler.js.

## Features

- 🎵 **Multi-pad grid** — 24+ configurable sound pads
- 🔊 **Multi-play** — Play multiple sounds simultaneously or overlap the same sound
- ⌨️ **Hotkeys** — Assign keyboard shortcuts to any pad
- 📁 **Categories** — Organize sounds into custom tabs
- 🔍 **Search** — Real-time filtering by sound name
- 🔉 **Master volume** — Global volume control with mute
- ⏹ **Stop All** — Stop all sounds instantly (or press Escape)
- 💾 **Auto-save** — State persists across sessions
- 📤 **Export/Import** — Share boards as .soundboard JSON files
- 🖱️ **Drag & Drop** — Drop audio files directly onto pads

## Installation

```bash
npm install
npm run dev       # Development mode
npm run build     # Production build
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Escape | Stop all sounds |
| Custom | Trigger assigned pad |

## Usage

1. Click **Add Sound** or the **+** button to add a new sound pad
2. Select an audio file (MP3, WAV, OGG, FLAC, M4A)
3. Click the pad to play; click again to overlap
4. **Right-click** a pad to rename, set hotkey, change category, or delete
5. Double-click a tab to rename it
6. Use **Export** to save your board as a `.soundboard` file

## Tech Stack

- **Electron** — Desktop shell
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Howler.js** — Audio engine
- **electron-store** — Persistence
