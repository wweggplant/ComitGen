/** @type {import('ts-jest').JestConfigWithTsJest} */
// turn esm to commonjs
// Path: jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node'
};