module.exports = {
  extends: 'hackreactor',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {
    camelcase: 'off'
  },
  env: {
    browser: true,
    node: true
  }
};