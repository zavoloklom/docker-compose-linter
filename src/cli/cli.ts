import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yargsLib from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadConfig } from '../config/config.js';
import { DCLinter } from '../linter/linter.js';
import type { CLIConfig } from './cli.types.js';
import { Logger, LOG_SOURCE } from '../util/logger.js';
import { loadFormatter } from '../util/formatter-loader.js';

const packageJson = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json'), 'utf-8'),
) as Record<string, unknown>;

const { argv } = yargsLib(hideBin(process.argv))
  .usage('Usage: $0 <files..> [options]')
  .version((packageJson?.version as string) || 'unknown')
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
    default: undefined,
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
  .help()
  .alias('version', 'v');

export default async function cli() {
  const args = (await argv) as unknown as CLIConfig;

  // Initialize the logger with the final debug and color options
  Logger.init(args.debug);
  const logger = Logger.getInstance();

  logger.debug(LOG_SOURCE.CLI, 'Debug mode is ON');
  logger.debug(LOG_SOURCE.CLI, 'Arguments:', args);

  const config = await loadConfig(args.config);

  // Override config values with CLI arguments if they are provided
  if (args.quiet) {
    config.quiet = args.quiet;
  }
  if (args.debug) {
    config.debug = args.debug;
  }
  if (args.exclude.length > 0) {
    config.exclude = args.exclude;
  }
  logger.debug(LOG_SOURCE.CLI, 'Final config:', config);

  const linter = new DCLinter(config);

  // Handle the `fix` and `fix-dry-run` flags
  if (args.fix || args.fixDryRun) {
    await linter.fixFiles(args.files, args.recursive, args.fixDryRun);
  }

  // Always run the linter after attempting to fix issues
  let lintResults = await linter.lintFiles(args.files, args.recursive);

  // Filter out warnings if `--quiet` is enabled
  if (args.quiet) {
    // Keep only files with errors
    lintResults = lintResults
      .map((result) => ({
        ...result,
        messages: result.messages.filter((message) => message.type === 'error'),
        errorCount: result.messages.filter((message) => message.type === 'error').length,
        warningCount: 0,
      }))
      .filter((result) => result.messages.length > 0);
  }

  // Count errors and warnings
  const totalErrors = lintResults.reduce((count, result) => count + result.errorCount, 0);
  const totalWarnings = lintResults.reduce((count, result) => count + result.warningCount, 0);

  // Choose and apply the formatter
  const formatter = await loadFormatter(args.formatter);
  const formattedResults = formatter(lintResults);

  // Output results
  if (args.outputFile) {
    writeFileSync(args.outputFile, formattedResults);
  } else {
    console.log(formattedResults);
  }

  // Determine exit code based on errors and warnings
  if (totalErrors > 0) {
    logger.debug(LOG_SOURCE.CLI, `${totalErrors} errors found`);
    process.exit(1);
  } else if (args.maxWarnings && args.maxWarnings >= 0 && totalWarnings > args.maxWarnings) {
    logger.debug(
      LOG_SOURCE.CLI,
      `Warning threshold exceeded: ${totalWarnings} warnings (max allowed: ${args.maxWarnings})`,
    );
    process.exit(1);
  }

  logger.debug(LOG_SOURCE.CLI, 'All files are valid.');
  process.exit(0);
}

await cli();
