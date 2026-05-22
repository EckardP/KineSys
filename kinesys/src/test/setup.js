import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

expect.extend({
  toHaveBeenCalledOnce(received) {
    const calls = received?.mock?.calls?.length;
    const pass = calls === 1;

    return {
      pass,
      message: () => `expected mock to be called once, but it was called ${calls ?? 0} times`,
    };
  },
});
