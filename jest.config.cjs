const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {

  preset: 'ts-jest',

  testEnvironment: "node",

  roots: ['<rootDir>/src', '<rootDir>/test'],

  testMatch: [
    '<rootDir>/test/**/?(*.)+(spec|test).ts?(x)'
  ],

  moduleNameMapper: {
    //directly links
    '^@_global-init_$': '<rootDir>/src/global-init.ts',
    //'^app_settings_dto$': '<rootDir>/src/app-settings.json',

    //api (types only)
    '^@core-api/(.*)$': '<rootDir>/src/api/core/$1',
    '^@app-api/(.*)$': '<rootDir>/src/api/app/$1',
    '^@game-api/(.*)$': '<rootDir>/src/api/game/$1',

    //platform: pixi, web, browser
    '^@pixi/(.*)$': '<rootDir>/src/platform/pixi/$1',
    '^@web/(.*)$': '<rootDir>/src/platform/web/$1',
    '^@browser/(.*)$': '<rootDir>/src/platform/browser/$1',
    '^@platform/(.*)$': '<rootDir>/src/platform/$1',

    //core
    '^core/(.*)$': '<rootDir>/src/core/$1',

    //gameplay
    '^game/(.*)$': '<rootDir>/src/game/$1',

    //assets
    '^assets/(.*)$': '<rootDir>/src/assets/$1',

    //app
    '^services/(.*)$': '<rootDir>/src/app/services/$1',
    '^user/(.*)$': '<rootDir>/src/app/user/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',

    //di
    '^@di/(.*)$': '<rootDir>/src/di/$1',
  },

  transform: {
    ...tsJestTransformCfg,
  },

};