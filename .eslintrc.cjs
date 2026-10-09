module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', '@vue/eslint-config-typescript'],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    // Видимість ModalWindow керується через v-if батьківського компонента
    // (весь компонент монтується/розмонтовується), тому Transition і без
    // внутрішнього v-if/v-show коректно відпрацьовує анімацію появи/зникнення.
    'vue/require-toggle-inside-transition': 'off',
  },
};
