module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 0,
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
