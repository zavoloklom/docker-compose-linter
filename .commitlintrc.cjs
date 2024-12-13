module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'rule',
                'feat',
                'fix',
                'refactor',
                'perf',
                'test',
                'deps',
                'docs',
                'ci',
                'chore',
                'revert',
                'release'
            ],
        ],
    },
    prompt: {
        questions: {
            type: {
                description: "Select the type of change that you're committing",
                enum: {
                    rule: {
                        description: 'A new rule',
                        title: 'Rules',
                        emoji: '✨'
                    },
                    feat: {
                        description: 'A new feature',
                        title: 'Features',
                        emoji: '✨'
                    },
                    fix: {
                        description: 'A bug fix',
                        title: 'Bug Fixes',
                        emoji: '🐛'
                    },
                    refactor: {
                        description: 'A code change that neither fixes a bug nor adds a feature (including formatting)',
                        title: 'Code Refactoring',
                        emoji: '📦'
                    },
                    perf: {
                        description: 'Changes that improve performance',
                        title: 'Performance Improvements',
                        emoji: '🚀'
                    },
                    test: {
                        description: 'Adding missing tests or correcting existing tests',
                        title: 'Tests',
                        emoji: '🚨'
                    },
                    deps: {
                        description: 'Any changes in dependencies',
                        title: 'Dependencies',
                        emoji: '📦'
                    },
                    docs: {
                        description: 'Documentation only changes',
                        title: 'Documentation',
                        emoji: '📚'
                    },
                    ci: {
                        description: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
                        title: 'Continuous Integrations',
                        emoji: '⚙️'
                    },
                    chore: {
                        description: 'Other changes that don\'t modify source or test files',
                        title: 'Chores',
                        emoji: '♻️'
                    },
                    revert: {
                        description: 'Reverts a commit',
                        title: 'Reverts',
                        emoji: '🗑'
                    },
                    release: {
                        description: 'Release new version. DO NOT USE IT.',
                        title: 'Release',
                        emoji: '🚀'
                    }
                }
            },
            scope: {
                description: 'What is the scope of this change (e.g. component or file name)'
            },
            subject: {
                description: 'Write a short, imperative tense description of the change'
            },
            body: { description: 'Provide a longer description of the change' },
            isBreaking: { description: 'Are there any breaking changes?' },
            breakingBody: {
                description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
            },
            breaking: { description: 'Describe the breaking changes' },
            isIssueAffected: { description: 'Does this change affect any open issues?' },
            issuesBody: {
                description: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
            },
            issues: {
                description: 'Add issue references (e.g. "ref: #123", "ref: #123, #124".)'
            }
        }
    }
};
