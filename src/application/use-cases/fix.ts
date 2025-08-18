import { fixContent } from '../../domain/services/fix-content';
import { type Logger } from '../ports/logger';

import type { FixSummary } from '../../domain/models/fix-summary';
import type { Config } from '../dto/config';
import type { ComposeDocumentFactory } from '../ports/compose-document-factory';
import type { ComposeValidator } from '../ports/compose-validator';
import type { FileWriter } from '../ports/file-writer';
import type { RulesLoader } from '../ports/rules-loader';
import type { Timer } from '../ports/timer';

interface FixUseCaseOptions {
  dryRun: boolean;
}

type FixUseCase = (paths: string[], config: Config, options: Partial<FixUseCaseOptions>) => Promise<FixSummary>;

type FixUseCaseDeps = {
  rulesLoader: RulesLoader;
  composeDocumentFactory: ComposeDocumentFactory;
  composeValidator: ComposeValidator;
  fileWriter: FileWriter;
  logger: Logger;
  timer: Timer;
};

// TODO: Log more info
const fixUseCase = async (
  paths: string[],
  config: Config,
  options: Partial<FixUseCaseOptions>,
  deps: FixUseCaseDeps,
): Promise<FixSummary> => {
  const { rulesLoader, composeDocumentFactory, composeValidator, timer, fileWriter } = deps;

  timer.start('total');

  const rules = await rulesLoader.load(config);

  timer.start('parse');
  const fileDiscoveryOptions = {
    recursive: config.recursive,
    exclude: config.exclude,
  };
  const documents = await composeDocumentFactory.fromPath(paths, fileDiscoveryOptions);
  timer.stop('parse');

  timer.start('fix');
  const fixedDocuments: string[] = [];
  const tasks: Promise<void>[] = [];
  for (const document of documents) {
    if (composeValidator.isValid(document)) {
      const fixedContent = fixContent(document, rules);
      fixedDocuments.push(document.filePath);
      if (options.dryRun) {
        // eslint-disable-next-line no-console
        console.log(fixedContent);
      } else {
        tasks.push(fileWriter.write(document.filePath, fixedContent));
      }
    }
  }
  await Promise.all(tasks).then(() => {
    timer.stop('fix');
  });

  timer.stop('total');

  return {
    documents: fixedDocuments,
    ...(config.stats
      ? {
          stats: {
            times: {
              parse: timer.get('parse'),
              fix: timer.get('fix'),
              total: timer.get('total'),
            },
          },
        }
      : {}),
  };
};

const makeFixUseCase = (deps: FixUseCaseDeps): FixUseCase => {
  return (paths, config, options) => fixUseCase(paths, config, options, deps);
};

export { makeFixUseCase, type FixUseCaseDeps, type FixUseCase, type FixUseCaseOptions };
