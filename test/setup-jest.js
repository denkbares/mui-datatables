// Ensure Jest's expect is used (not chai's)
const jestExpect = global.expect;
require('@testing-library/jest-dom');
require('./setup-enzyme-jest');
global.expect = jestExpect;
