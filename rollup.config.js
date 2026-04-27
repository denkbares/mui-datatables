import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import uglify from '@lopatnov/rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@mui/material',
    '@mui/icons-material',
    '@mui/system',
    '@emotion/react',
    '@emotion/styled',
    /^@mui\//,
    /^@emotion\//,
    'prop-types',
    'clsx',
    'react-to-print',
    'react-dnd',
    'react-dnd-html5-backend',
    'tss-react',
    'tss-react/mui',
    /^lodash\./,
    /^@babel\/runtime/,
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
    babel({
      babelHelpers: 'runtime',
      babelrc: true,
    }),
    uglify({
      compress: {
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  },
};
