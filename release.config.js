export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogTitle:
          '# Changelog' +
          '\n\n> This file was generated automatically using [@semantic-release](https://github.com/semantic-release/semantic-release).',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run markdownlint:fix-changelog || true',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        // eslint-disable-next-line no-template-curly-in-string
        message: 'release: ${nextRelease.version} [skip ci]',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'README.md',
            label: 'Documentation',
          },
          {
            path: 'CHANGELOG.md',
            label: 'Changelog',
          },
          {
            path: 'pkg/dclint-alpine',
            label: 'DClint Linux Binary',
          },
          {
            path: 'pkg/dclint-bullseye',
            label: 'DClint Ubuntu Binary',
          },
        ],
      },
    ],
  ],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      {
        type: 'build',
        section: 'Build System',
      },
      {
        type: 'chore',
        section: 'Others',
      },
      {
        type: 'ci',
        section: 'CI/CD',
      },
      {
        type: 'deps',
        section: 'Dependencies',
      },
      {
        type: 'docs',
        section: 'Documentation',
      },
      {
        type: 'feat',
        section: 'Features',
      },
      {
        type: 'fix',
        section: 'Bug Fixes',
      },
      {
        type: 'perf',
        section: 'Performance Improvements',
      },
      {
        type: 'refactor',
        section: 'Code Refactoring',
      },
      {
        type: 'revert',
        section: 'Reverts',
      },
      {
        type: 'style',
        section: 'Styling',
      },
      {
        type: 'test',
        section: 'Tests',
      },
    ],
    releaseRules: [
      {
        type: 'ci',
        release: false,
      },
      {
        type: 'style',
        release: false,
      },
      {
        type: 'test',
        release: false,
      },
    ],
    userUrlFormat: 'https://github.com/{{user}}',
  },
};
