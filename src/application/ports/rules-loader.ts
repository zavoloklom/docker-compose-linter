import type { Rule } from '../../domain/models/rule';
import type { Config } from '../dto/config';

interface RulesLoader {
  load(config: Config): Promise<Rule[]>;
}

export { RulesLoader };
