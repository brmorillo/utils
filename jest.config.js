module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        module: 'esnext',
      },
    },
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.int-spec.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
    {
      displayName: 'benchmark',
      testMatch: ['<rootDir>/tests/benchmark/**/*.bench.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
    },
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    'src/config/',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  maxWorkers: '50%',
  verbose: true,
};