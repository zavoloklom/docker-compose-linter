/**
 * Normalized options coming from the CLI layer.
 */
interface CliOptions {
  /**
   * Files to process.
   */
  files: string[];

  /**
   * Recursively searches directories for Docker Compose files.
   * @default false
   */
  recursive: boolean;

  /**
   * Automatically fixes problems in the Docker Compose files.
   * @default false
   */
  fix: boolean;

  /**
   * Simulates the automatic fixing of problems without actually saving the changes.
   * @default false
   */
  fixDryRun: boolean;

  /**
   * Specifies the output format for the linting results.
   * @default 'stylish'
   */
  formatter: string;

  /**
   * Provides the path to a custom configuration file.
   */
  config?: string;

  /**
   * Limits the output to errors only, hiding warnings.
   * @default false
   */
  quiet: boolean;

  /**
   * Specifies the maximum number of allowed warnings before triggering a nonzero exit code.
   * @default -1
   */
  maxWarnings: number;

  /**
   * Specifies a file to write the linting report to.
   */
  outputFile?: string;

  /**
   * Forces the enabling or disabling of color output.
   * @default true
   */
  color: boolean;

  /**
   * Outputs debugging information to the console.
   * @default false
   */
  debug: boolean;

  /**
   * Excludes specific files or directories from being checked.
   * @default []
   */
  exclude: string[];

  /**
   * Skips the execution of specific rules.
   * @default []
   */
  disableRule: string[];

  /**
   * Collect stats.
   * @default false
   */
  stats: boolean;
}

export { CliOptions };
