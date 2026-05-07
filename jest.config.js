import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// jest.config.js
export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"], // keep this
}; 