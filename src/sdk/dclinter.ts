import { mergeWithDefaults } from '../application/config/merge-with-defaults';
import { FormatterLoader } from '../application/ports/formatter-loader';
import { type FixUseCase, type FixUseCaseOptions, makeFixUseCase } from '../application/use-cases/fix';
import { type FormatUseCase, makeFormatUseCase } from '../application/use-cases/format';
import { LintUseCase, makeLintUseCase } from '../application/use-cases/lint';
import { AjvComposeValidator } from '../infrastructure/compose-validator/ajv-compose-validator';
import { FsFileFinder } from '../infrastructure/file/fs-file-finder';
import { FsFileReader } from '../infrastructure/file/fs-file-reader';
import { FsFileWriter } from '../infrastructure/file/fs-file-writer';
import { DefaultFormatterLoader } from '../infrastructure/formatter-loader/default-formatter-loader';
import { ConsoleLogger } from '../infrastructure/logger/console-logger';
import { DefaultRulesLoader } from '../infrastructure/rules-loader/default-rules-loader';
import { makePerformanceTimer } from '../infrastructure/timer/performance-timer';
import { YamlComposeDocumentFactory } from '../infrastructure/yaml/yaml-compose-document-factory';

import type { Config } from '../application/dto/config';
import type { ComposeDocumentFactory } from '../application/ports/compose-document-factory';
import type { ComposeValidator } from '../application/ports/compose-validator';
import type { FileFinder } from '../application/ports/file-finder';
import type { FileReader } from '../application/ports/file-reader';
import type { FileWriter } from '../application/ports/file-writer';
import type { Logger } from '../application/ports/logger';
import type { RulesLoader } from '../application/ports/rules-loader';
import type { Timer } from '../application/ports/timer';
import type { FixSummary } from '../domain/models/fix-summary';
import type { LintSummary } from '../domain/models/lint-summary';
import type { Rule } from '../domain/models/rule';

export class DCLinter {
  private readonly config: Config;
  private readonly logger: Logger;
  private readonly lintUseCase: LintUseCase;
  private readonly fixUseCase: FixUseCase;
  private readonly formatUseCase: FormatUseCase;

  private readonly timer: Timer;
  private readonly rulesLoader: RulesLoader;
  private readonly formatterLoader: FormatterLoader;
  private readonly fileFinder: FileFinder;
  private readonly fileReader: FileReader;
  private readonly fileWriter: FileWriter;
  private readonly composeDocumentFactory: ComposeDocumentFactory;
  private readonly composeValidator: ComposeValidator;

  constructor(config: Partial<Config> = {}) {
    this.config = mergeWithDefaults(config);
    this.logger = ConsoleLogger.init(config.debug);
    this.timer = makePerformanceTimer(this.config.stats);
    this.rulesLoader = new DefaultRulesLoader(this.config, this.logger);
    this.formatterLoader = new DefaultFormatterLoader(this.logger);
    this.fileFinder = new FsFileFinder(this.logger);
    this.fileReader = new FsFileReader(this.logger);
    this.fileWriter = new FsFileWriter(this.logger);
    this.composeDocumentFactory = new YamlComposeDocumentFactory(this.fileFinder, this.fileReader, this.logger);
    this.composeValidator = new AjvComposeValidator();

    this.lintUseCase = makeLintUseCase({
      rulesLoader: this.rulesLoader,
      composeDocumentFactory: this.composeDocumentFactory,
      composeValidator: this.composeValidator,
      logger: this.logger,
      timer: this.timer,
    });
    this.fixUseCase = makeFixUseCase({
      rulesLoader: this.rulesLoader,
      composeDocumentFactory: this.composeDocumentFactory,
      composeValidator: this.composeValidator,
      fileWriter: this.fileWriter,
      logger: this.logger,
      timer: this.timer,
    });
    this.formatUseCase = makeFormatUseCase({
      formatterLoader: this.formatterLoader,
      logger: this.logger,
    });
  }

  async lint(filePath: string[]): Promise<LintSummary> {
    return await this.lintUseCase(filePath, this.config);
  }

  async fix(filePath: string[], options: Partial<FixUseCaseOptions> = {}): Promise<FixSummary> {
    return this.fixUseCase(filePath, this.config, options);
  }

  async lintAndFix(filePath: string[], fixOptions: Partial<FixUseCaseOptions> = {}): Promise<LintSummary> {
    await this.fixUseCase(filePath, this.config, fixOptions);
    return await this.lintUseCase(filePath, this.config);
  }

  async format(lintSummary: LintSummary, nameOrPath: string = ''): Promise<string> {
    return await this.formatUseCase(lintSummary, nameOrPath);
  }

  async getRules(): Promise<Rule[]> {
    return await this.rulesLoader.load(this.config);
  }
}
