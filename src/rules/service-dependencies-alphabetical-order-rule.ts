import { parseDocument, isSeq, isScalar, isMap, isPair } from 'yaml';
import type {
    LintContext,
    LintMessage,
    LintMessageType,
    LintRule,
    LintRuleCategory,
    LintRuleSeverity,
    RuleMeta,
} from '../linter/linter.types.js';
import { findLineNumberForService } from '../util/line-finder.js';

export default class ServiceDependenciesAlphabeticalOrderRule implements LintRule {
    public name = 'service-dependencies-alphabetical-order';

    public type: LintMessageType = 'warning';

    public category: LintRuleCategory = 'style';

    public severity: LintRuleSeverity = 'info';

    public meta: RuleMeta = {
        description: 'Ensure that the services listed in the depends_on directive are sorted alphabetically.',
        url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-dependencies-alphabetical-order-rule.md',
    };

    public fixable: boolean = true;

    // eslint-disable-next-line class-methods-use-this
    public getMessage = ({ serviceName }: { serviceName: string }): string => {
        return `Services in "depends_on" for service "${serviceName}" should be in alphabetical order.`;
    };

    private static extractServiceName(yamlNode: unknown): string {
        // Short Syntax
        if (isScalar(yamlNode)) {
            return String(yamlNode.value);
        }
        // Long Syntax
        if (isPair(yamlNode)) {
            return String(yamlNode.key);
        }
        return '';
    }

    public check(context: LintContext): LintMessage[] {
        const errors: LintMessage[] = [];
        const doc = parseDocument(context.sourceCode);
        const services = doc.get('services');

        if (!isMap(services)) return [];

        services.items.forEach((serviceItem) => {
            if (!isScalar(serviceItem.key)) return;

            const serviceName = String(serviceItem.key.value);
            const service = serviceItem.value;

            if (!service || !isMap(service)) return;

            const dependsOn = service.get('depends_on');
            if (!isSeq(dependsOn) && !isMap(dependsOn)) return;

            const extractedDependencies = dependsOn.items.map((item) =>
                ServiceDependenciesAlphabeticalOrderRule.extractServiceName(item),
            );
            const sortedDependencies = [...extractedDependencies].sort((a, b) => a.localeCompare(b));

            if (JSON.stringify(extractedDependencies) !== JSON.stringify(sortedDependencies)) {
                const line = findLineNumberForService(doc, context.sourceCode, serviceName, 'depends_on');
                errors.push({
                    rule: this.name,
                    type: this.type,
                    category: this.category,
                    severity: this.severity,
                    message: this.getMessage({ serviceName }),
                    line,
                    column: 1,
                    meta: this.meta,
                    fixable: this.fixable,
                });
            }
        });

        return errors;
    }

    // eslint-disable-next-line class-methods-use-this
    public fix(content: string): string {
        const doc = parseDocument(content);
        const services = doc.get('services');

        if (!isMap(services)) return content;

        services.items.forEach((serviceItem) => {
            const service = serviceItem.value;
            if (!service || !isMap(service)) return;

            const dependsOn = service.get('depends_on');
            if (!isSeq(dependsOn) && !isMap(dependsOn)) return;

            dependsOn.items.sort((a, b) => {
                const valueA = ServiceDependenciesAlphabeticalOrderRule.extractServiceName(a);
                const valueB = ServiceDependenciesAlphabeticalOrderRule.extractServiceName(b);
                return valueA.localeCompare(valueB);
            });
        });

        return doc.toString();
    }
}
