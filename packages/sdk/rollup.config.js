import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default [
  // ESM + CJS
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
      { file: 'dist/index.js', format: 'cjs', sourcemap: true },
    ],
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
  },
  // UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/tradlibras.min.js',
      format: 'umd',
      name: 'TradLibras',
      sourcemap: true,
      globals: {}
    },
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()],
  },
  // Additional UMD alias
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/sdk.umd.js',
      format: 'umd',
      name: 'TradLibras',
      sourcemap: true
    },
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
  },
];

