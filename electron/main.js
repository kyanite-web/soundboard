const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const store = require('./store');

let mainWindow;

function createSoundsDir() {
  const soundsDir = path.join(app.getPath('userData'), 'sounds');
  if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
  }
  return soundsDir;
}

function createWindow() {
  const bounds = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width: bounds.width || 1200,
    height: bounds.height || 800,
    x: bounds.x,
    y: bounds.y,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true,
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', bounds);
  });
}

app.whenReady().then(() => {
  createSoundsDir();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('dialog-open-file', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a'] },
    ],
    ...options,
  });
  return result;
});

ipcMain.handle('copy-audio-file', async (event, sourcePath, fileName) => {
  const soundsDir = createSoundsDir();
  const destPath = path.join(soundsDir, fileName);
  fs.copyFileSync(sourcePath, destPath);
  return destPath;
});

ipcMain.handle('get-audio-path', (event, fileName) => {
  const soundsDir = path.join(app.getPath('userData'), 'sounds');
  return path.join(soundsDir, fileName);
});

ipcMain.handle('export-board', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'my-soundboard.soundboard',
    filters: [{ name: 'Soundboard Files', extensions: ['soundboard'] }],
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, filePath: result.filePath };
  }
  return { success: false };
});

ipcMain.handle('export-board-zip', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'my-soundboard.zip',
    filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
  });

  if (!result.canceled && result.filePath) {
    const JSZip = require('jszip');
    const zip = new JSZip();

    zip.file('board.soundboard', JSON.stringify(data.board, null, 2));

    const soundsDir = path.join(app.getPath('userData'), 'sounds');
    for (const pad of data.board.pads || []) {
      if (pad.filePath) {
        const fileName = path.basename(pad.filePath);
        const filePath = path.join(soundsDir, fileName);
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          zip.folder('sounds').file(fileName, fileData);
        }
      }
    }

    const zipData = await zip.generateAsync({ type: 'nodebuffer' });
    fs.writeFileSync(result.filePath, zipData);
    return { success: true, filePath: result.filePath };
  }
  return { success: false };
});

ipcMain.handle('import-board', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Soundboard Files', extensions: ['soundboard', 'json'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8');
      const data = JSON.parse(content);
      const soundsDir = path.join(app.getPath('userData'), 'sounds');
      return { success: true, data, soundsDir };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  return { success: false };
});
