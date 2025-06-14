module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0, 'always', 'sentence-case'],
    'body-max-line-length': [2, 'always', 100]
  }
};