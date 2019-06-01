module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'globals': {
    'use': false
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'windows'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': 1,

    'arrow-parens': 0,
    'one-var': 0,
    'no-param-reassign': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'linebreak-style': 0,
    'global-require': 0,
    'no-underscore-dangle': 0,
    'eslint linebreak-style': [0, 'error', 'windows'],
    'quotes': [ 'error','single' ],
    'semi': [ 'error','always' ],
    'func-names': ['error', 'never'],
    'max-len': ['warn',
      {
        'code': 150,
        'ignoreUrls': true,
        'ignoreTrailingComments': true,
        'ignoreTemplateLiterals': true,
      }
    ],
    'prefer-destructuring': 'off',
    'no-unused-vars': 'warn',

  },
};
