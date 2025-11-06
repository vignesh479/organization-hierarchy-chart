import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.scrollIntoView (not implemented in JSDOM)
Element.prototype.scrollIntoView = jest.fn();

// Mock fetch for all tests
global.fetch = jest.fn();

// Mock HTML5 drag and drop API
global.DragEvent = class DragEvent extends Event {
  constructor(type, options) {
    super(type, options);
    this.dataTransfer = options?.dataTransfer || {
      effectAllowed: 'all',
      dropEffect: 'none',
      files: [],
      items: [],
      types: [],
      getData: jest.fn(),
      setData: jest.fn(),
      clearData: jest.fn(),
    };
  }
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

