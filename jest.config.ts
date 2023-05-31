/** @type {import('ts-jest').JestConfigWithTsJest} */

import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ["**/?(*.)+(spec|test).ts"]
}

export default config;