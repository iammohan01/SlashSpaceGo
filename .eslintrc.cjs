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
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
      }],
      "no-console": "warn",
      "no-restricted-syntax": [
          "error",
          {
              "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
              "message": "Unexpected property on console object was called"
          }
      ],
    'react-refresh/only-export-components': ['error', {allowConstantExport: true},],
    "no-unused-expressions": "off",
    "camelcase": ["error"],
  },
}
