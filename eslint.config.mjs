import esLintTS from "typescript-eslint";
import stylisticTs from '@stylistic/eslint-plugin-ts';
import importPlugin from 'eslint-plugin-import';

// import eslint-rules: [
//import rules from './.eslint-rules.json' assert { type: 'json' };
import { createRequire } from 'module';
const rules = createRequire(import.meta.url)('./.eslint-rules.json');
// ]

export default esLintTS.config(
	{
		name: "project's root config",
		extends: [
			...esLintTS.configs.recommended,
		],
		files: [
			"**/*.{ts,tsx}"
		],
		ignores: [
			"dist",
			"build/",
			"temp/",
			//"src/_global-init_",
			"node_modules/",
			"vite.config.ts"
		],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'import': importPlugin,
			'@stylistic/ts': stylisticTs,
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		rules
	},
);
