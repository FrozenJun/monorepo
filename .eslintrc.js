module.exports = {
  root: true,

  env: {
    es2021: true,
    node: true,
    // The Follow config only works with eslint-plugin-vue v8.0.0+
    'vue/setup-compiler-macros': true,
  },

  globals: {
    wx: 'readonly', // 或者 "writable"，取决于你是否需要写入 `wx`
    getCurrentPages: 'readonly', // 或者 "writable"，取决于你是否需要写入 `wx`
  },

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ['git'], // 使用 eslint --staged 命令来仅检查暂存区中的文件

  rules: {
    // https://eslint.vuejs.org/rules
    'vue/attributes-order': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/order-in-components': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // 关闭any类型警告

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
}
