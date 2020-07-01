module.exports = {
  extends: 'hackreactor',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {},
  env: {
    browser: true,
    node: true
  }
};