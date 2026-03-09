export function serializeBoard(pads, categories, volume, mute, activeTab) {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    pads: pads.map(pad => ({
      ...pad,
      // Store only relative filename so it can be re-imported
      fileName: pad.filePath ? pad.filePath.split(/[\\/]/).pop() : null,
    })),
    categories,
    settings: { volume, mute, activeTab },
  };
}

export function validateImport(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid board file: not a JSON object');
  }
  if (!Array.isArray(data.pads)) {
    throw new Error('Invalid board file: missing pads array');
  }
  return true;
}

export function deserializeBoard(data, soundsDir) {
  validateImport(data);

  const pads = data.pads.map(pad => ({
    ...pad,
    filePath: pad.fileName && soundsDir
      // Normalize separators to forward slashes for file:// URL compatibility
      ? [soundsDir.replace(/\\/g, '/'), pad.fileName].join('/')
      : pad.filePath || null,
  }));

  return {
    pads,
    categories: Array.isArray(data.categories) ? data.categories : [],
    settings: data.settings || {},
  };
}
