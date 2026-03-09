const Store = require('electron-store');

const schema = {
  pads: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        filePath: { type: ['string', 'null'] },
        category: { type: ['string', 'null'] },
        hotkey: { type: ['string', 'null'] },
        color: { type: ['string', 'null'] },
      },
      required: ['id', 'name'],
    },
  },
  categories: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id', 'name'],
    },
  },
  volume: {
    type: 'number',
    default: 1.0,
    minimum: 0,
    maximum: 1,
  },
  mute: {
    type: 'boolean',
    default: false,
  },
  activeTab: {
    type: 'string',
    default: 'all',
  },
  windowBounds: {
    type: 'object',
    default: { width: 1200, height: 800 },
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      width: { type: 'number' },
      height: { type: 'number' },
    },
  },
};

const store = new Store({ schema });

module.exports = store;
