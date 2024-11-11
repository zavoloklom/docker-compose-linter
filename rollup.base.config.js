import fs from 'node:fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { version } = packageJson;

export default (outDir, declaration = false, minify = false) => {
  const plugins = [
    json(),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: './tsconfig.json',
      outDir,
      declaration,
      declarationDir: declaration ? `${outDir}/types` : null,
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
