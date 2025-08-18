import { CliOptions } from '../dto/cli-options';
import { Config } from '../dto/config';

interface ConfigLoader {
  get(): Config;
  load(path?: string): this;
  withDefaults(): this;
  mergeCliOptions(options: CliOptions): this;
  validate(): this;
}

export { ConfigLoader };
