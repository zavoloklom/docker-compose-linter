import { Scalar, isMap, isScalar, isSeq } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { NodeLocation } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface NoQuotesInVolumesIssueContext {
  serviceName: string;
  volume: string;
}

class NoQuotesInVolumesRule implements Rule<NoQuotesInVolumesIssueContext> {
  static readonly ID = 'no-quotes-in-volumes';
  static readonly TYPE = RuleType.WARNING;

  readonly id = NoQuotesInVolumesRule.ID;

  readonly type: RuleType = NoQuotesInVolumesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.MINOR;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Service "volumes" property values SHOULD NOT be quoted.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-quotes-in-volumes-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<NoQuotesInVolumesIssueContext>[] {
    const issues: LintIssue<NoQuotesInVolumesIssueContext>[] = [];
    this.handleViolation(document, (serviceName, volume, location) => {
      issues.push(createLintIssue(this, location, { serviceName, volume: String(volume.value) }));
    });
    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (serviceName, volume, location) => {
      volume.type = 'PLAIN';
    });
    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: NoQuotesInVolumesIssueContext): string {
    return `Unexpected quotes around volume "${context.volume}" in service "${context.serviceName}".`;
  }

  // eslint-disable-next-line class-methods-use-this
  private handleViolation(
    document: YamlComposeDocument,
    callback: (serviceName: string, volume: Scalar, location: NodeLocation) => void,
  ) {
    for (const service of document.getServices()) {
      const volumes = service.get('volumes');
      if (!volumes || !isSeq(volumes)) continue;
      for (const [index, volume] of volumes.items.entries()) {
        if (isScalar(volume) && volume.type !== 'PLAIN') {
          const location = document.getNodeLocation(['services', service.name, 'volumes', String(volume.value)]);
          callback(service.name, volume, location);
        }

        if (!isMap(volume)) continue;

        const source = volume.get('source', true);
        if (isScalar(source) && source.type !== 'PLAIN') {
          const location = document.getNodeLocation(['services', service.name, 'volumes', index, 'source']);
          callback(service.name, source, location);
        }

        const target = volume.get('target', true);
        if (isScalar(target) && target.type !== 'PLAIN') {
          const location = document.getNodeLocation(['services', service.name, 'volumes', index, 'target']);
          callback(service.name, target, location);
        }

        const subpath = volume.getIn(['volume', 'subpath'], true);
        if (isScalar(subpath) && subpath.type !== 'PLAIN') {
          const location = document.getNodeLocation(['services', service.name, 'volumes', index, 'volume', 'subpath']);
          callback(service.name, subpath, location);
        }
      }
    }
  }
}

export { NoQuotesInVolumesRule, type NoQuotesInVolumesIssueContext };
