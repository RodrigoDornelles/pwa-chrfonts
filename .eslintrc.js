module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      //'prettier/@typescript-eslint',
      //'plugin:prettier/recommended',
    ],
    rules: {
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es6: true,
    },
};
  