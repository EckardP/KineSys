const babelJest = require('babel-jest');

const transformer = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
});

module.exports = {
  canInstrument: true,
  process(sourceText, sourcePath, transformOptions) {
    const sourceForJest = sourcePath.includes('.test.')
      ? sourceText
          .replace(/\bvi\.mock\s*\(/g, 'jest.mock(')
          .replace(/\bvi\.fn\s*\(/g, 'jest.fn(')
      : sourceText;

    return transformer.process(sourceForJest, sourcePath, transformOptions);
  },
};
