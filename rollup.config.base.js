import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = process.env.VERSION ?? packageJson?.version;

const rollup = (outDirectory, declaration = false, minify = false) => {
  const plugins = [
    json(),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: './tsconfig.json',
      outDir: outDirectory,
      declaration,
      declarationDir: declaration ? `${outDirectory}/types` : null,
      include: ['src/**/*.ts', 'schemas/*.json'],
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
    }),
    replace({
      preventAssignment: true,
      'process.env.VERSION': JSON.stringify(version),
    }),
  ];

  if (minify) {
    plugins.push(terser());
  }

  return { plugins };
};

// eslint-disable-next-line import/no-default-export
export default rollup;
