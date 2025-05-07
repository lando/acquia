import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Configurations from eslint:recommended and google
const baseConfigs = compat.extends('eslint:recommended', 'google');

export default [
  {
    ignores: ['**/temp', '**/cache', '**/dist', '**/_site', '!**/.vitepress'],
  },
  ...baseConfigs,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },

      parser: babelParser,
      ecmaVersion: 8,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,
      },
    },

    rules: {
      'arrow-parens': ['error', 'as-needed'],

      'indent': ['error', 2, {
        MemberExpression: 1,
        SwitchCase: 1,
      }],

      'max-len': ['error', {
        code: 140,
        ignoreComments: true,
      }],

      'no-empty': ['error', {
        allowEmptyCatch: true,
      }],

      'no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      }],

      'require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      }],
    },
  },
];
