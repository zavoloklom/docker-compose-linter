import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import type { LintRule, LintMessageType } from '../linter/linter.types.js';
import type { Config, ConfigRuleLevel, ConfigRule } from '../config/config.types.js';
import { Logger } from './logger.js';

async function importRule(file: string, rulesDir: string): Promise<LintRule | null> {
    const logger = Logger.getInstance();
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const RuleClass = (await import(path.join(rulesDir, file))).default;

        if (typeof RuleClass === 'function') {
            return new (RuleClass as new () => LintRule)();
        }
        return null;
    } catch (error) {
        logger.error(`Error importing rule from file: ${file}`, error);
        return null;
    }
}

async function loadLintRules(config: Config): Promise<LintRule[]> {
    const rulesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../rules');

    const ruleFiles = fs
        .readdirSync(rulesDir)
        .filter((file) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('d.ts')));

    // Parallel import with Promise.all
    const ruleInstances: (LintRule | null)[] = await Promise.all(
        ruleFiles.map(async (file) => importRule(file, rulesDir)),
    );

    const activeRules: LintRule[] = [];

    ruleInstances.forEach((ruleInstance) => {
        if (!ruleInstance) return;

        const ruleConfig: ConfigRule = config.rules[ruleInstance.name];

        let ruleLevel: ConfigRuleLevel;
        let ruleOptions: Record<string, unknown> | undefined;

        if (Array.isArray(ruleConfig)) {
            [ruleLevel, ruleOptions] = ruleConfig;
        } else {
            ruleLevel = ruleConfig;
        }

        if (ruleLevel === 0) return;

        const RuleClass = ruleInstance.constructor as new (options?: Record<string, unknown>) => LintRule;
        const instance = ruleOptions ? new RuleClass(ruleOptions) : new RuleClass();

        const typeMap: { [key: number]: LintMessageType } = {
            1: 'warning',
            2: 'error',
        };

        instance.type = typeMap[ruleLevel] || instance.type;

        activeRules.push(instance);
    });

    return activeRules;
}

export { loadLintRules };
