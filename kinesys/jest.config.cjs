module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/jest.transform.cjs',
  },
  moduleNameMapper: {
    '^vitest$': '<rootDir>/src/test/jest/vitest-shim.cjs',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/src/test/jest/style-mock.cjs',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/src/test/jest/file-mock.cjs',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
};
