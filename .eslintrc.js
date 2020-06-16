module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'jsx-quotes': [ 1, 'prefer-single' ],
    'prettier/prettier': 0,
    'space-in-parens': [ 1, 'always' ],
    'indent': [ 1, 4 ],
    'comma-dangle': [ 1, 'never' ]
  },
};
