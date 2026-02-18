module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // Cegah penggunaan type 'any' - akan muncul error jika ada 'any'
    '@typescript-eslint/no-explicit-any': 'error',
    // Wajib menuliskan return type untuk exported functions
    '@typescript-eslint/explicit-module-boundary-types': 'error',
  },
}
