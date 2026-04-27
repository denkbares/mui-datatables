module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
      ],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(tss-react|@mui|cheerio)/)',
  ],
  testMatch: ['<rootDir>/test/**/*.test.js'],
};
