import { Ajv, type ValidateFunction } from 'ajv';

import { ajvErrorToValidationIssueMapper } from './ajv-error-to-validation-issue-mapper';
import configSchema from '../../../schemas/dclint-config.schema.json' with { type: 'json' };

import type { Config } from '../../application/dto/config';
import type { ConfigValidationIssue } from '../../application/dto/config-validation-issue';
import type { ConfigValidator } from '../../application/ports/config-validator';
import * as Rules from "../../plugins/rules";

class AjvConfigValidator implements ConfigValidator {
  private readonly validateFn: ValidateFunction;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      strictSchema: false,
      allowUnionTypes: true,
      logger: false,
    });
    this.validateFn = ajv.compile(configSchema);
  }

  validate(config: Config): ConfigValidationIssue[] {
    return this.getSchemaErrors(config);
  }

  isValid(config: Config): boolean {
    return this.validateFn(config);
  }

  private getSchemaErrors(config: Config): ConfigValidationIssue[] {
    const errors: ConfigValidationIssue[] = [];
    const isValid = this.validateFn(config);

    if (!isValid && Array.isArray(this.validateFn.errors)) {
      for (const error of this.validateFn.errors) {
        errors.push(ajvErrorToValidationIssueMapper(error));
      }
    }

    return errors;
  }

  // TODO: Decide what to do with it
  private validateRuleNames() {
    // Validate rules names
    // const allowedRuleNames = new Set<string>(Object.values(Rules).map((ruleClass) => ruleClass.name));

    // for (const ruleName of Object.keys(this.config.rules)) {
    //   if (!allowedRuleNames.has(ruleName)) {
    //     throw new ConfigValidationError([
    //       {
    //         instancePath: `/rules/${ruleName}`,
    //         message: `Unknown rule name "${ruleName}"`,
    //         schemaPath: '#/rules',
    //         keyword: 'custom',
    //         params: {},
    //       },
    //     ]);
    //   }
    // }
  }
}

export { AjvConfigValidator };
