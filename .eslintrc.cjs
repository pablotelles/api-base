/* eslint config raiz: aplica a api e web */
module.exports = {
  root: true,
  env: { node: true, es2023: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./apps/api/tsconfig.eslint.json'], // adicione web depois
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'promise',
    'node',
    // 'prettier', // se quiser rodar Prettier via ESLint
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:node/recommended',
    // 'plugin:prettier/recommended', // ativa eslint-plugin-prettier + mostra erros de formatação como erros do ESLint
    'eslint-config-prettier', // garante que ESLint não brigue com Prettier
  ],
  rules: {
    // Typescript: segurança em promessas
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],

    // Imports ordenados e consistentes
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'off', // TS já cuida disso
    'import/no-default-export': 'off', // ajuste se quiser evitar default

    // Node (desliga regras antigas que conflitam com ESM/TS)
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',

    // Estilo que o Prettier formata (não deixe o ESLint brigar)
    'max-len': 'off',
    'arrow-body-style': 'off',
    // 'prettier/prettier': 'error', // só se usar plugin Prettier no ESLint
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      env: { jest: true, node: true },
    },
  ],
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/build/**'],
};
