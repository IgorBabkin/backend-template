/* eslint-disable no-undef */
module.exports = {
  testMatch: ['**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/fixtures/', '__tests__'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
