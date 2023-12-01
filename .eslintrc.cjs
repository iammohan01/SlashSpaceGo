module.exports = {
  root: true, env: {browser: true, es2022: true},
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: ['dist'],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', "@typescript-eslint"],
  rules: {
    'react-refresh/only-export-components': ['error', {allowConstantExport: true},],
    "no-unused-expressions": "off",
    "camelcase": ["error"],
  },
}
