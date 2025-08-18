#!/usr/bin/env node

import yargsLib from 'yargs';
import { hideBin } from 'yargs/helpers';

import { CLI_DEFAULT_OPTIONS } from '../application/cli-options/defaults';
import { LogSource } from '../application/ports/logger';
import { AjvConfigValidator } from '../infrastructure/config/ajv-config-validator';
import { CosmicConfigLoader } from '../infrastructure/config/cosmic-config-loader';
import { ConsoleLogger } from '../infrastructure/logger/console-logger';
import { DCLinter } from '../sdk/dclinter';

import type { CliOptions } from '../application/dto/cli-options';

const main = async () => {
  process.env.NODE_NO_WARNINGS = '1';
  const { argv } = yargsLib(hideBin(process.argv))
    .usage('Usage: $0 <files..> [options]')
    .version(process.env.VERSION ?? 'unknown')
    .command('$0 <files..>', 'Check the files', (yargs) => {
      yargs.positional('files', {
        describe: 'Files to check',
        type: 'string',
        array: true,
        demandOption: true,
      });
    })
    .option('recursive', {
      alias: 'r',
      type: 'boolean',
      description: 'Recursively search directories for Docker Compose files',
      default: CLI_DEFAULT_OPTIONS.recursive,
    })
    .option('fix', {
      type: 'boolean',
      description: 'Automatically fix problems',
      default: CLI_DEFAULT_OPTIONS.fix,
    })
    .option('fix-dry-run', {
      type: 'boolean',
      description: 'Automatically fix problems without saving the changes to the file system',
      default: CLI_DEFAULT_OPTIONS.fixDryRun,
    })
    .option('formatter', {
      alias: 'f',
      type: 'string',
      description: 'Use a specific output format - default: stylish',
      default: CLI_DEFAULT_OPTIONS.formatter,
    })
    .option('config', {
      alias: 'c',
      type: 'string',
      description: 'Path to config file',
    })
    .option('quiet', {
      alias: 'q',
      type: 'boolean',
      description: 'Report errors only',
      default: CLI_DEFAULT_OPTIONS.quiet,
    })
    .option('output-file', {
      alias: 'o',
      type: 'string',
      description: 'Specify file to write report to',
    })
    .option('color', {
      type: 'boolean',
      description: 'Force enabling/disabling of color',
      default: CLI_DEFAULT_OPTIONS.color,
    })
    .option('debug', {
      type: 'boolean',
      description: 'Output debugging information',
      default: CLI_DEFAULT_OPTIONS.debug,
    })
    .option('exclude', {
      alias: 'e',
      type: 'array',
      description: 'Files or directories to exclude from the search',
      default: CLI_DEFAULT_OPTIONS.exclude,
    })
    .option('max-warnings', {
      type: 'number',
      description: 'Number of warnings to trigger nonzero exit code',
      default: CLI_DEFAULT_OPTIONS.maxWarnings,
    })
    .option('disable-rule', {
      type: 'array',
      description: 'List of rule names to skip during linting',
      default: CLI_DEFAULT_OPTIONS.disableRule,
    })
    .option('stats', {
      type: 'boolean',
      description: 'Collect statistic data',
      default: CLI_DEFAULT_OPTIONS.stats,
    })
    .help()
    .alias('version', 'v');

  const cliOptions = argv as unknown as CliOptions;

  const logger = ConsoleLogger.init(cliOptions.debug);

  logger.debug(LogSource.CLI, 'Debug mode is ON');
  logger.debug(LogSource.CLI, 'Arguments:', JSON.stringify(cliOptions));

  const configValidator = new AjvConfigValidator();
  const config = CosmicConfigLoader.init(configValidator, logger)
    .load(cliOptions.config)
    .withDefaults()
    .mergeCliOptions(cliOptions)
    .validate()
    .get();

  logger.debug(LogSource.CLI, 'Final config:\n', JSON.stringify(config, null, 2));

  const linter = new DCLinter(config);

  if (cliOptions.fix || cliOptions.fixDryRun) {
    const fixSummary = await linter.fix(cliOptions.files, { dryRun: cliOptions.fixDryRun });
    logger.debug(LogSource.CLI, 'Fix summary:\n', JSON.stringify(fixSummary, null, 2));
  }

  const lintSummary = await linter.lint(cliOptions.files);

  logger.debug(LogSource.CLI, 'Lint summary:\n', JSON.stringify(lintSummary, null, 2));
  logger.debug(LogSource.CLI, `${lintSummary.count.error} errors found`);
  logger.debug(LogSource.CLI, `${lintSummary.count.warning} warnings found`);

  const formattedResults = await linter.format(lintSummary, cliOptions.formatter);

  if (cliOptions.outputFile) {
    // TODO: Change to format(lintSummary, { formatters:['pretty']}, output:['console'] })
    // writeFileSync(cliOptions.outputFile, formattedResults);
  } else {
    // eslint-disable-next-line no-console
    console.log(formattedResults);
  }

  if (lintSummary.count.error > 0) {
    process.exit(1);
  } else if (!config.quiet && cliOptions.maxWarnings >= 0 && lintSummary.count.warning > cliOptions.maxWarnings) {
    logger.debug(
      LogSource.CLI,
      `Warning threshold exceeded: ${lintSummary.count.warning} warnings (max allowed: ${cliOptions.maxWarnings})`,
    );
    process.exit(1);
  }

  logger.debug(LogSource.CLI, 'All files are valid.');
  process.exit(0);
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
