require('jest-extended');
process.env.NODE_ENV = 'test';

const jestTimeout = 100000;

jest.setTimeout(jestTimeout);
