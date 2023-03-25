module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'eslint-config-ali/vue',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-trailing-spaces': 'off',
    'semi': 0,
    "comma-dangle": 0
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".vue", ".ts", ".json"]
      }
    }
  }
}
