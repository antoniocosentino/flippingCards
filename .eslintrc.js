module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'jsx-quotes': [1, 'prefer-single'],
    'prettier/prettier': 0,
    'space-in-parens': [1, 'always'],
    'object-curly-spacing': [1, 'always'],
    "key-spacing": [1, { "beforeColon": false, "afterColon": true }],
    "react/jsx-curly-spacing": [1, {
      "when": "always",
      "children": {
        "when": "always"
      }
    }],
    'indent': [1, 4, { "SwitchCase": 1 }],
    'comma-dangle': [1, 'never'],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1
  },
};
