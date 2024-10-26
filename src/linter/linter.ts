import fs from 'node:fs';
import { parseDocument, YAMLError } from 'yaml';
import type { Config } from '../config/config.types.js';
import type { LintRule, LintMessage, LintResult, LintContext } from './linter.types.js';
import { findFilesForLinting } from '../util/files-finder.js';
import { loadLintRules } from '../util/rules-loader.js';
import { Logger, LOG_SOURCE } from '../util/logger.js';
import { validationComposeSchema } from '../util/compose-validation.js';
import { ComposeValidationError } from '../errors/compose-validation-error.js';

class DCLinter {
    private readonly config: Config;

    private rules: LintRule[];

    constructor(config: Config) {
        this.config = config;
        this.rules = [];
        Logger.init(this.config.debug);
    }

    private async loadRules() {
        if (this.rules.length === 0) {
            this.rules = await loadLintRules(this.config);
        }
    }

    private lintContent(context: LintContext): LintMessage[] {
        const messages: LintMessage[] = [];

        this.rules.forEach((rule) => {
            const ruleMessages = rule.check(context);
            messages.push(...ruleMessages);
        });

        return messages;
    }

    private static validateFile(file: string): { context: LintContext | null; messages: LintMessage[] } {
        const logger = Logger.getInstance();
        const messages: LintMessage[] = [];
        const context: LintContext = { path: file, content: {}, sourceCode: '' };

        try {
            context.sourceCode = fs.readFileSync(file, 'utf8');
            const doc = parseDocument(context.sourceCode, { merge: true });

            if (doc.errors && doc.errors.length > 0) {
                doc.errors.forEach((error) => {
                    throw error;
                });
            }

            // Use Record<string, unknown> to type the parsed content safely
            context.content = doc.toJS() as Record<string, unknown>;
            validationComposeSchema(context.content);
        } catch (e: unknown) {
            if (e instanceof YAMLError) {
                const startPos: { line: number; col: number } | undefined = Array.isArray(e.linePos)
                    ? e.linePos[0]
                    : e.linePos;
                messages.push({
                    rule: 'invalid-yaml',
                    category: 'style',
                    severity: 'critical',
                    message: 'Invalid YAML format.',
                    line: startPos?.line || 1,
                    column: startPos?.col || 1,
                    type: 'error',
                    fixable: false,
                });
            } else if (e instanceof ComposeValidationError) {
                messages.push({
                    rule: 'invalid-schema',
                    type: 'error',
                    category: 'style',
                    severity: 'critical',
                    message: e.toString(),
                    line: 1,
                    column: 1,
                    fixable: false,
                });
            } else {
                messages.push({
                    rule: 'unknown-error',
                    category: 'style',
                    severity: 'critical',
                    message: 'unknown-error',
                    line: 1,
                    column: 1,
                    type: 'error',
                    fixable: false,
                });
                logger.debug(LOG_SOURCE.LINTER, `Error while processing file ${file}`, e);
            }

            return { context: null, messages };
        }

        return { context, messages };
    }

    public async lintFiles(paths: string[], doRecursiveSearch: boolean): Promise<LintResult[]> {
        const logger = Logger.getInstance();
        const lintResults: LintResult[] = [];
        await this.loadRules();
        const files = findFilesForLinting(paths, doRecursiveSearch, this.config.exclude);
        logger.debug(LOG_SOURCE.LINTER, `Compose files for linting: ${files.toString()}`);

        files.forEach((file) => {
            logger.debug(LOG_SOURCE.LINTER, `Linting file: ${file}`);

            const { context, messages } = DCLinter.validateFile(file);
            if (context) {
                const fileMessages = this.lintContent(context);
                messages.push(...fileMessages);
            }

            const errorCount = messages.filter((msg) => msg.type === 'error').length;
            const warningCount = messages.filter((msg) => msg.type === 'warning').length;
            const fixableErrorCount = messages.filter((msg) => msg.fixable && msg.type === 'error').length;
            const fixableWarningCount = messages.filter((msg) => msg.fixable && msg.type === 'warning').length;

            lintResults.push({
                filePath: file,
                messages,
                errorCount,
                warningCount,
                fixableErrorCount,
                fixableWarningCount,
            });
        });

        logger.debug(LOG_SOURCE.LINTER, 'Linting result:', JSON.stringify(lintResults));
        return lintResults;
    }

    public async fixFiles(paths: string[], doRecursiveSearch: boolean, dryRun: boolean = false): Promise<void> {
        const logger = Logger.getInstance();
        await this.loadRules();
        const files = findFilesForLinting(paths, doRecursiveSearch, this.config.exclude);
        logger.debug(LOG_SOURCE.LINTER, `Compose files for fixing: ${files.toString()}`);

        files.forEach((file) => {
            logger.debug(LOG_SOURCE.LINTER, `Fixing file: ${file}`);

            const { context, messages } = DCLinter.validateFile(file);
            if (!context) {
                logger.debug(LOG_SOURCE.LINTER, `Skipping file due to validation errors: ${file}`);
                messages.forEach((message) => logger.debug(LOG_SOURCE.LINTER, JSON.stringify(message)));
                return;
            }

            let content = context.sourceCode;

            this.rules.forEach((rule) => {
                if (typeof rule.fix === 'function') {
                    content = rule.fix(content);
                }
            });

            if (dryRun) {
                logger.info(`Dry run - changes for file: ${file}`);
                logger.info('\n\n', content);
            } else {
                fs.writeFileSync(file, content, 'utf8');
                logger.debug(LOG_SOURCE.LINTER, `File fixed: ${file}`);
            }
        });
    }
}

export { DCLinter };
