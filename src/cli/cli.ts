#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import yargsLib from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ConfigLoader } from '../config/config-loader';
import { DCLinter } from '../linter/linter';
import { LOG_SOURCE, Logger } from '../util/logger';

import type { CLIConfig } from './cli.types';

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
      default: false,
    })
    .option('fix', {
      type: 'boolean',
      description: 'Automatically fix problems',
      default: false,
    })
    .option('fix-dry-run', {
      type: 'boolean',
      description: 'Automatically fix problems without saving the changes to the file system',
      default: false,
    })
    .option('formatter', {
      alias: 'f',
      type: 'string',
      description: 'Use a specific output format - default: stylish',
      default: 'stylish',
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
      default: false,
    })
    .option('output-file', {
      alias: 'o',
      type: 'string',
      description: 'Specify file to write report to',
    })
    .option('color', {
      type: 'boolean',
      description: 'Force enabling/disabling of color',
      default: true,
    })
    .option('debug', {
      type: 'boolean',
      description: 'Output debugging information',
      default: false,
    })
    .option('exclude', {
      alias: 'e',
      type: 'array',
      description: 'Files or directories to exclude from the search',
      default: [],
    })
    .option('max-warnings', {
      type: 'number',
      description: 'Number of warnings to trigger nonzero exit code',
      default: -1,
    })
    .option('disable-rule', {
      type: 'array',
      description: 'List of rule names to skip during linting',
      default: [],
    })
    .help()
    .alias('version', 'v');

  const cliArguments = argv as unknown as CLIConfig;

  const logger = Logger.init(cliArguments.debug);

  logger.debug(LOG_SOURCE.CLI, 'Debug mode is ON');
  logger.debug(LOG_SOURCE.CLI, 'Arguments:', cliArguments);

  const config = ConfigLoader.init(cliArguments.debug)
    .load(cliArguments.config)
    .mergeCli(cliArguments)
    .withDefaults()
    .validate()
    .get();

  logger.debug(LOG_SOURCE.CLI, 'Final config:', config);

  const linter = new DCLinter(config);

  if (cliArguments.fix || cliArguments.fixDryRun) {
    linter.fixFiles(cliArguments.files, cliArguments.recursive, cliArguments.fixDryRun);
  }

  let lintResults = linter.lintFiles(cliArguments.files, cliArguments.recursive);

  if (config.quiet) {
    lintResults = lintResults
      .map((result) => ({
        ...result,
        messages: result.messages.filter((message) => message.type === 'error'),
        errorCount: result.messages.filter((message) => message.type === 'error').length,
        warningCount: 0,
      }))
      .filter((result) => result.messages.length > 0);
  }

  const totalErrors = lintResults.reduce((count, result) => count + result.errorCount, 0);
  const totalWarnings = lintResults.reduce((count, result) => count + result.warningCount, 0);

  const formattedResults = await linter.formatResults(lintResults, cliArguments.formatter);

  if (cliArguments.outputFile) {
    writeFileSync(cliArguments.outputFile, formattedResults);
  } else {
    // eslint-disable-next-line no-console
    console.log(formattedResults);
  }

  if (totalErrors > 0) {
    logger.debug(LOG_SOURCE.CLI, `${totalErrors} errors found`);
    process.exit(1);
  } else if (cliArguments.maxWarnings >= 0 && totalWarnings > cliArguments.maxWarnings) {
    logger.debug(
      LOG_SOURCE.CLI,
      `Warning threshold exceeded: ${totalWarnings} warnings (max allowed: ${cliArguments.maxWarnings})`,
    );
    process.exit(1);
  }

  logger.debug(LOG_SOURCE.CLI, 'All files are valid.');
  process.exit(0);
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
