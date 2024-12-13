export default {
  branches: ['main', { name: 'beta', prerelease: true, channel: 'beta' }],
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
    [
      '@semantic-release/exec',
      {
        // eslint-disable-next-line no-template-curly-in-string
        verifyReleaseCmd: 'echo ${nextRelease.version} > .VERSION',
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
            path: 'sea/dclint-alpine-amd64',
            label: 'DClint Alpine Linux Binary (amd64)',
          },
          {
            path: 'sea/dclint-bullseye-amd64',
            label: 'DClint Bullseye Linux Binary (amd64)',
          },
          {
            path: 'sea/dclint-alpine-arm64',
            label: 'DClint Alpine Linux Binary (arm64)',
          },
          {
            path: 'sea/dclint-bullseye-arm64',
            label: 'DClint Bullseye Linux Binary (arm64)',
          },
        ],
      },
    ],
  ],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      {
        type: 'rule',
        section: 'New Rules',
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
        type: 'refactor',
        section: 'Code Refactoring',
      },
      {
        type: 'perf',
        section: 'Performance Improvements',
      },
      {
        type: 'test',
        section: 'Tests',
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
        type: 'ci',
        section: 'CI/CD',
      },
      {
        type: 'chore',
        section: 'Others',
      },
      {
        type: 'revert',
        section: 'Reverts',
      },
    ],
    releaseRules: [
      {
        type: 'rule',
        release: 'major',
      },
      {
        type: 'feat',
        release: 'minor',
      },
      {
        type: 'fix',
        release: 'patch',
      },
      {
        type: 'refactor',
        release: false,
      },
      {
        type: 'perf',
        release: 'patch',
      },
      {
        type: 'test',
        release: false,
      },
      {
        type: 'deps',
        scope: 'dev',
        release: false,
      },
      {
        type: 'deps',
        release: 'patch',
      },
      {
        type: 'docs',
        release: false,
      },
      {
        type: 'ci',
        release: false,
      },
      {
        type: 'chore',
        release: false,
      },
      {
        type: 'revert',
        release: 'patch',
      },
      {
        type: 'release',
        release: false,
      },
    ],
    userUrlFormat: 'https://github.com/{{user}}',
  },
};
