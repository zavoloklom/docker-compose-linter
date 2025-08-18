import type { Config } from '../dto/config';
import type { ConfigValidationIssue } from '../dto/config-validation-issue';

interface ConfigValidator {
  isValid(config: Config): boolean;
  validate(config: Config): ConfigValidationIssue[];
}

export { ConfigValidator };
