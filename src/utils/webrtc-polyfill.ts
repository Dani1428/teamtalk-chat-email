import { Buffer } from 'buffer';
import nextTick from 'next-tick';

// Polyfills for Node.js built-ins
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
  version: '',
  nextTick: nextTick,
};
(window as any).Buffer = Buffer;
