const stubs = new Map();

function stubGlobal(name, value) {
  if (!stubs.has(name)) {
    stubs.set(name, {
      exists: Object.prototype.hasOwnProperty.call(globalThis, name),
      value: globalThis[name],
    });
  }

  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });

  return globalThis;
}

function unstubAllGlobals() {
  for (const [name, previous] of stubs.entries()) {
    if (previous.exists) {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        writable: true,
        value: previous.value,
      });
    } else {
      delete globalThis[name];
    }
  }

  stubs.clear();
}

const vi = {
  fn: (...args) => jest.fn(...args),
  mock: (...args) => jest.mock(...args),
  spyOn: (...args) => jest.spyOn(...args),
  clearAllMocks: () => jest.clearAllMocks(),
  resetAllMocks: () => jest.resetAllMocks(),
  restoreAllMocks: () => jest.restoreAllMocks(),
  stubGlobal,
  unstubAllGlobals,
};

module.exports = {
  afterAll: globalThis.afterAll,
  afterEach: globalThis.afterEach,
  beforeAll: globalThis.beforeAll,
  beforeEach: globalThis.beforeEach,
  describe: globalThis.describe,
  expect: globalThis.expect,
  it: globalThis.it,
  test: globalThis.test,
  vi,
};
