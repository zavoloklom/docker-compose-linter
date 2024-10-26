import { parseDocument, isMap, isSeq, isScalar } from 'yaml';
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
import { extractPublishedPortValue, extractPublishedPortInferfaceValue } from '../util/service-ports-parser.js';

export default class NoDuplicateExportedPortsRule implements LintRule {
    public name = 'no-duplicate-exported-ports';

    public type: LintMessageType = 'error';

    public category: LintRuleCategory = 'security';

    public severity: LintRuleSeverity = 'critical';

    public meta: RuleMeta = {
        description:
            'Ensure that exported ports in Docker Compose are bound to specific Interfaces to prevent accidential exposure of containers.',
        url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-duplicate-exported-ports-rule.md',
    };

    public fixable = false;

    // eslint-disable-next-line class-methods-use-this
    public getMessage({ serviceName, publishedPort }: { serviceName: string; publishedPort: string }): string {
        return `Service "${serviceName}" is exporting port "${publishedPort}" without specifing the interface to listen on.`;
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

            if (!isMap(service) || !service.has('ports')) return;

            const ports = service.get('ports');
            if (!isSeq(ports)) return;

            ports.items.forEach((portItem) => {
                const publishedInterface = extractPublishedPortInferfaceValue(portItem);
                const publishedPort = extractPublishedPortValue(portItem);

                if (publishedInterface === '') {
                    const line = findLineNumberForService(doc, context.sourceCode, serviceName, 'ports');
                    errors.push({
                        rule: this.name,
                        type: this.type,
                        category: this.category,
                        severity: this.severity,
                        message:
                            this.getMessage({
                                serviceName,
                                publishedPort,
                            }) + String(ports),
                        line,
                        column: 1,
                        meta: this.meta,
                        fixable: this.fixable,
                    });
                }
            });
        });
        return errors;
    }
}
